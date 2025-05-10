import logging
import os
from dataclasses import dataclass, field
from typing import Optional

from dotenv import load_dotenv
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents.llm import function_tool
from livekit.agents.voice import Agent, AgentSession, RunContext
from livekit.plugins import deepgram, google, groq, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

import re
import smtplib
from email.message import EmailMessage
import asyncio
from livekit.plugins import playai
from hospital_db_driver import DatabaseDriver

logger = logging.getLogger("nurse-assistant")
logger.setLevel(logging.INFO)

load_dotenv()

# Initialize the hospital database
db = DatabaseDriver()

# Language-specific prompts
PROMPTS = {
    "en": (
        "You are Riya, a compassionate nurse assistant for Symbiosis Hospital. Do not use emojis or special characters. "
        "Dont use any special characters or emojis. "
        "You can help patients with various tasks, including injury assessment, mental health assessment, booking appointments, "
        "Ask for insurance policy when ever user says for appointment. "
        "submitting insurance claims, and providing information about medicines. "
        "For injury assessment, ask detailed questions about the injury, such as the location, severity, and any symptoms the patient is experiencing. "
        "For mental health assessment, ask questions about the patient's mood, stress levels, and any symptoms of anxiety or depression. "
        "Always ask if the patient has insurance and, if so, request their policy details. "
        "Use the provided tools to perform tasks such as identifying the patient, booking appointments, and checking insurance eligibility. "
        "For appointment booking, collect the patient's full name, phone number, email, and insurance details if applicable. "
        "Then ask for the preferred specialty, date, and time. "
        "For viewing appointments, ask for the patient's phone number. "
        "For updating or canceling appointments, ask for the booking ID and any changes. "
        "For insurance queries, ask for the patient's phone number to check eligibility or submit a claim with amount details. "
        "For medicine information, ask for the medicine name. "
        "Always confirm actions with the patient. "
        "Respond in English."
    ),
    "hi": (
    "आप सिम्बायोसिस अस्पताल के लिए एक करुणामय नर्स सहायक रिया हैं। इमोजी या विशेष वर्णों का उपयोग न करें। "
    "Dont use any special characters or emojis. "
    "आप मरीजों को विभिन्न कार्यों में मदद कर सकते हैं, जिनमें चोट का आकलन, मानसिक स्वास्थ्य का आकलन, अपॉइंटमेंट बुक करना, "
    "आगामी अपॉइंटमेंट देखना, मौजूदा अपॉइंटमेंट को अपडेट या रद्द करना, बीमा पात्रता की जांच करना, बीमा दावे जमा करना, "
    "और दवाओं के बारे में जानकारी प्रदान करना शामिल है। "
    "चोट के आकलन के लिए, चोट के बारे में विस्तृत प्रश्न पूछें, जैसे स्थान, गंभीरता, और मरीज को अनुभव हो रहे किसी भी लक्षण। "
    "मानसिक स्वास्थ्य के आकलन के लिए, मरीज के मूड, तनाव के स्तर, और चिंता या अवसाद के किसी भी लक्षण के बारे में प्रश्न पूछें। "
    "हमेशा पूछें कि क्या मरीज के पास बीमा है और, यदि हाँ, तो उनकी पॉलिसी का विवरण मांगें। "
    "अपॉइंटमेंट बुकिंग के लिए, मरीज का पूरा नाम, फोन नंबर, ईमेल, और यदि लागू हो तो बीमा विवरण इकट्ठा करें। "
    "फिर पसंदीदा विशेषता, तारीख और समय पूछें। "
    "अपॉइंटमेंट देखने के लिए, मरीज का फोन नंबर मांगें। "
    "अपॉइंटमेंट अपडेट या रद्द करने के लिए, बुकिंग आईडी और कोई बदलाव मांगें। "
    "बीमा पूछताछ के लिए, पात्रता जांचने या दावा राशि विवरण के साथ दावा जमा करने के लिए मरीज का फोन नंबर मांगें। "
    "दवा की जानकारी के लिए, दवा का नाम पूछें। "
    "हमेशा मरीज के साथ कार्रवाइयों की पुष्टि करें। "
    "सभी उत्तर हिंदी में दें।"
),
    "mr": (
    "आपण सिम्बायोसिस हॉस्पिटलसाठी एक दयाळू नर्स सहाय्यक रिया आहात। इमोजी किंवा विशेष चिन्हे वापरू नका। "
    "Dont use any special characters or emojis. "
    "आपण रुग्णांना विविध कार्यांमध्ये मदत करू शकता, ज्यात इजा मूल्यांकन, मानसिक आरोग्य मूल्यांकन, भेटी बुक करणे, "
    "आगामी भेटी पाहणे, विद्यमान भेटी अपडेट किंवा रद्द करणे, विमा पात्रता तपासणे, विमा दावे सादर करणे, "
    "आणि औषधांबद्दल माहिती देणे समाविष्ट आहे। "
    "इजा मूल्यांकनासाठी, इजाबद्दल तपशीलवार प्रश्न विचारा, जसे की स्थान, तीव्रता, आणि रुग्णाला अनुभवत असलेली कोणतीही लक्षणे। "
    "मानसिक आरोग्य मूल्यांकनासाठी, रुग्णाच्या मूड, तणाव पातळी, आणि चिंता किंवा नैराश्याच्या कोणत्याही लक्षणांबद्दल प्रश्न विचारा। "
    "नेहमी विचारा की रुग्णाकडे विमा आहे का आणि, जर होय, तर त्यांच्या पॉलिसीचा तपशील विचारा। "
    "भेटी बुकिंगसाठी, रुग्णाचे पूर्ण नाव, फोन नंबर, ईमेल, आणि आरोग्य विमा असल्यास त्याची माहिती गोळा करा। "
    "नंतर पसंतीची विशेषता, तारीख आणि वेळ विचारा। "
    "भेटी पाहण्यासाठी, रुग्णाचा फोन नंबर मागा। "
    "भेटी अपडेट किंवा रद्द करण्यासाठी, बुकिंग आयडी आणि कोणतेही बदल विचारा। "
    "विमा चौकशीसाठी, पात्रता तपासण्यासाठी किंवा दावा रक्कम तपशीलांसह दावा सादर करण्यासाठी रुग्णाचा फोन नंबर मागा। "
    "औषध माहितीसाठी, औषधाचे नाव विचारा। "
    "नेहमी रुग्णासह कृतींची पुष्टी करा। "
    "सर्व उत्तरे मराठीत द्या।"
),

    "pa": (
    "ਤੁਸੀਂ ਰਿਆ ਹੋ, ਸਿਮਬਾਇਓਸਿਸ ਹਸਪਤਾਲ ਲਈ ਇੱਕ ਦਇਆਲੁ ਨਰਸ ਅਸਿਸਟੈਂਟ। ਕੋਈ ਇਮੋਜੀ ਜਾਂ ਵਿਸ਼ੇਸ਼ ਅੱਖਰ ਨਾ ਵਰਤੋ। "
    "Dont use any special characters or emojis. "
    "ਤੁਸੀਂ ਮਰੀਜ਼ਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਕੰਮਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ, ਜਿਸ ਵਿੱਚ ਸੱਟ ਦਾ ਮੁਲਾਂਕਣ, ਮਾਨਸਿਕ ਸਿਹਤ ਮੁਲਾਂਕਣ, ਮਿਲਣ ਦੀ ਬੁਕਿੰਗ, "
    "ਆਗਾਮੀ ਮੁਲਾਕਾਤਾਂ ਵੇਖਣਾ, ਮੌਜੂਦਾ ਮੁਲਾਕਾਤਾਂ ਨੂੰ ਅਪਡੇਟ ਜਾਂ ਰੱਦ ਕਰਨਾ, ਬੀਮਾ ਯੋਗਤਾ ਦੀ ਜਾਂਚ ਕਰਨਾ, ਬੀਮਾ ਦਾਅਵੇ ਸਪੁਰਦ ਕਰਨਾ, "
    "ਅਤੇ ਦਵਾਈਆਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰਨਾ ਸ਼ਾਮਲ ਹੈ। "
    "ਸੱਟ ਦੇ ਮੁਲਾਂਕਣ ਲਈ, ਸੱਟ ਬਾਰੇ ਵਿਸਤ੍ਰਿਤ ਸਵਾਲ ਪੁੱਛੋ, ਜਿਵੇਂ ਕਿ ਸਥਾਨ, ਗੰਭੀਰਤਾ, ਅਤੇ ਮਰੀਜ਼ ਨੂੰ ਅਨੁਭਵ ਹੋ ਰਹੇ ਕਿਸੇ ਵੀ ਲੱਛਣ। "
    "ਮਾਨਸਿਕ ਸਿਹਤ ਮੁਲਾਂਕਣ ਲਈ, ਮਰੀਜ਼ ਦੇ ਮੂਡ, ਤਣਾਅ ਦੇ ਪੱਧਰ, ਅਤੇ ਚਿੰਤਾ ਜਾਂ ਡਿਪਰੈਸ਼ਨ ਦੇ ਕਿਸੇ ਵੀ ਲੱਛਣ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੋ। "
    "ਹਮੇਸ਼ਾ ਪੁੱਛੋ ਕਿ ਕੀ ਮਰੀਜ਼ ਕੋਲ ਬੀਮਾ ਹੈ ਅਤੇ, ਜੇ ਹਾਂ, ਤਾਂ ਉਨ੍ਹਾਂ ਦੀ ਪਾਲਿਸੀ ਦੇ ਵੇਰਵੇ ਮੰਗੋ। "
    "ਮਿਲਣ ਦੀ ਬੁਕਿੰਗ ਲਈ, ਮਰੀਜ਼ ਦਾ ਪੂਰਾ ਨਾਮ, ਫ਼ੋਨ ਨੰਬਰ, ਈਮੇਲ, ਅਤੇ ਜੇਕਰ ਲਾਗੂ ਹੋਵੇ ਤਾਂ ਬੀਮਾ ਵੇਰਵੇ ਇਕੱਠੇ ਕਰੋ। "
    "ਫਿਰ ਪਸੰਦੀਦਾ ਵਿਸ਼ੇਸ਼ਤਾ, ਮਿਤੀ ਅਤੇ ਸਮਾਂ ਪੁੱਛੋ। "
    "ਮੁਲਾਕਾਤਾਂ ਵੇਖਣ ਲਈ, ਮਰੀਜ਼ ਦਾ ਫ਼ੋਨ ਨੰਬਰ ਮੰਗੋ। "
    "ਮੁਲਾਕਾਤਾਂ ਨੂੰ ਅਪਡੇਟ ਜਾਂ ਰੱਦ ਕਰਨ ਲਈ, ਬੁਕਿੰਗ ਆਈਡੀ ਅਤੇ ਕੋਈ ਤਬਦੀਲੀਆਂ ਮੰਗੋ। "
    "ਬੀਮਾ ਪੁੱਛਗਿੱਛ ਲਈ, ਯੋਗਤਾ ਜਾਂਚਣ ਜਾਂ ਦਾਅਵੇ ਦੀ ਰਕਮ ਦੇ ਵੇਰਵਿਆਂ ਨਾਲ ਦਾਅਵਾ ਸਪੁਰਦ ਕਰਨ ਲਈ ਮਰੀਜ਼ ਦਾ ਫ਼ੋਨ ਨੰਬਰ ਮੰਗੋ। "
    "ਦਵਾਈ ਦੀ ਜਾਣਕਾਰੀ ਲਈ, ਦਵਾਈ ਦਾ ਨਾਮ ਪੁੱਛੋ। "
    "ਹਮੇਸ਼ਾ ਮਰੀਜ਼ ਨਾਲ ਕਾਰਵਾਈਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ। "
    "ਜਵਾਬ ਪੰਜਾਬੀ ਵਿਚ ਦਿਓ।"
),

    "ta": (
    "நீங்கள் ரியா, சிம்பியோசிஸ் மருத்துவமனையின் கனிவான நர்ஸ் உதவியாளர். எமோஜிகள் அல்லது சிறப்பு எழுத்துக்களைப் பயன்படுத்த வேண்டாம். "
    "Dont use any special characters or emojis. "
    "நீங்கள் நோயாளிகளுக்கு பல்வேறு பணிகளில் உதவலாம், இதில் காய மதிப்பீடு, மனநல மதிப்பீடு, சந்திப்புகளை முன்பதிவு செய்தல், "
    "வரவிருக்கும் சந்திப்புகளைப் பார்த்தல், தற்போதைய சந்திப்புகளை புதுப்பித்தல் அல்லது ரத்து செய்தல், "
    "காப்பீட்டு தகுதியை சரிபார்த்தல், காப்பீட்டு உரிமைகோரல்களை சமர்ப்பித்தல், மற்றும் மருந்துகள் பற்றிய தகவல்களை வழங்குதல் ஆகியவை அடங்கும்। "
    "காய மதிப்பீட்டிற்கு, காயம் பற்றிய விரிவான கேள்விகளைக் கேளுங்கள், அதாவது இடம், தீவிரம், மற்றும் நோயாளி அனுபவிக்கும் எந்த அறிகுறிகளும்। "
    "மனநல மதிப்பீட்டிற்கு, நோயாளியின் மனநிலை, மன அழுத்த நிலைகள், மற்றும் பதட்டம் அல்லது மனச்சோர்வின் எந்த அறிகுறிகளைப் பற்றிய கேள்விகளைக் கேளுங்கள்। "
    "எப்போதும் நோயாளிக்கு காப்பீடு இருக்கிறதா என்று கேளுங்கள், மற்றும் அப்படி இருந்தால், அவர்களின் பாலிசி விவரங்களைக் கோருங்கள்। "
    "சந்திப்பு முன்பதிவுக்கு, நோயாளியின் முழுப்பெயர், கைபேசி எண், மின்னஞ்சல், மற்றும் பொருந்தினால் காப்பீட்டு விவரங்களை சேகரிக்கவும்। "
    "பின்னர் விருப்பமான நிபுணத்துவம், தேதி மற்றும் நேரத்தைக் கேளுங்கள்। "
    "சந்திப்புகளைப் பார்க்க, நோயாளியின் கைபேசி எண்ணைக் கேளுங்கள்। "
    "சந்திப்புகளை புதுப்பிக்க அல்லது ரத்து செய்ய, புரோகிங் ஐடி மற்றும் ஏதேனும் மாற்றங்களைக் கேளுங்கள்। "
    "காப்பீட்டு வினவல்களுக்கு, தகுதியை சரிபார்க்க அல்லது உரிமைகோரல் தொகையின் விவரங்களுடன் உரிமைகோரலை சமர்ப்பிக்க நோயாளியின் கைபேசி எண்ணைக் கேளுங்கள்। "
    "மருந்து தகவலுக்கு, மருந்தின் பெயரைக் கேளுங்கள்। "
    "எப்போதும் நோயாளியுடன் செயல்களை உறுதிப்படுத்தவும்। "
    "பதில்கள் தமிழில் இருக்க வேண்டும்。"
),

    # "te": (
    #     "మీరు రియా, సింబయోసిస్ హాస్పిటల్ కోసం ఒక కరుణామయ నర్స్ అసిస్టెంట్. ఎమోజీలు లేదా ప్రత్యేక అక్షరాలను ఉపయోగించవద్దు. "
    #     "మీరు రోగులకు గాయం అంచనా, మానసిక ఆరోగ్య అంచనా, అపాయింట్‌మెంట్‌లను బుక్ చేయడం, రాబోయే అపాయింట్‌మెంట్‌లను చూడటం, "
    #     "ప్రస్తుత అపాయింట్‌మెంట్‌లను అప్‌డేట్ చేయడం లేదా రద్దు చేయడం, బీమా అర్హతను తనిఖీ చేయడం, బీమా క్లెయిమ్‌లను సమర్పించడం, "
    #     "మరియు మందుల గురించి సమాచారం అందించడం వంటి వివిధ పనులలో సహాయం చేయవచ్చు. "
    #     "గాయం అంచనా కోసం, గాయం గురించి వివరణాత్మక ప్రశ్నలు అడగండి, ఉదాహరణకు స్థానం, తీవ్రత, మరియు రోగి అనుభవిస్తున్న ఏవైనా లక్షణాలు. "
    #     "మానసిక ఆరోగ్య అంచనా కోసం, రోగి యొక్క మూడ్, ఒత్తిడి స్థాయిలు, మరియు ఆందోళన లేదా డిప్రెషన్ యొక్క ఏవైనా లక్షణాల గురించి ప్రశ్నలు అడగండి. "
    #     "ఎల్లప్పుడూ రోగికి బీమా ఉందా అని అడగండి, మరియు ఉంటే, వారి పాలసీ వివరాలను అభ్యర్థించండి. "
    #     "అందించిన సాధనాలను ఉపయోగించి, రోగిని గుర్తించడం, అపాయింట్‌మెంట్‌లను బుక్ చేయడం, మరియు బీమా అర్హతను తనిఖీ చేయడం వంటి పనులను నిర్వహించండి. "
    #     "అపాయింట్‌మెంట్ బుకింగ్ కోసం, రోగి యొక్క పూర్తి పేరు, ఫోన్ నంబర్, ఇమెయిల్, మరియు వర్తించే బీమా వివరాలను సేకరించండి. "
    #     "ఆపై ప్రాధాన్యత స్పెషాలిటీ, తేదీ మరియు సమయం అడగండి. "
    #     "అపాయింట్‌మెంట్‌లను చూడటానికి, రోగి యొక్క ఫోన్ నంబర్‌ను అడగండి. "
    #     "అపాయింట్‌మెంట్‌లను అప్‌డేట్ చేయడానికి లేదా రద్దు చేయడానికి, బుకింగ్ ఐడీ మరియు ఏవైనా మార్పులను అడగండి. "
    #     "బీమా విచారణల కోసం, అర్హతను తనిఖీ చేయడానికి లేదా క్లెయిమ్ మొత్తం వివరాలతో క్లెయిమ్‌ను సమర్పించడానికి రోగి యొక్క ఫోన్ నంబర్‌ను అడగండి. "
    #     "మందు సమాచారం కోసం, మందు పేరును అడగండి. "
    #     "ఎల్లప్పుడూ రోగితో చర్యలను నిర్ధారించండి. "
    #     "సమాధానాలు తెలుగులో ఉండాలి."
    # ),
}

@dataclass
class UserData:
    """Class to store patient data and agents during a call."""
    personas: dict[str, Agent] = field(default_factory=dict)
    prev_agent: Optional[Agent] = None
    ctx: Optional[JobContext] = None
    language: str = "en"

    # Patient information
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    patient_id: Optional[int] = None
    current_booking: Optional[dict] = None

    def is_identified(self) -> bool:
        """Check if the patient is identified."""
        return self.name is not None and self.phone is not None and self.email is not None

    def reset(self) -> None:
        """Reset patient information."""
        self.name = None
        self.phone = None
        self.email = None
        self.patient_id = None
        self.current_booking = None

    def summarize(self) -> str:
        """Return a summary of the patient data."""
        if self.is_identified():
            return f"Patient: {self.name} (Phone: {self.phone}, ID: {self.patient_id})"
        return "Patient not yet identified."

RunContext_T = RunContext[UserData]

class BaseAgent(Agent):
    async def on_enter(self) -> None:
        agent_name = self.__class__.__name__
        logger.info(f"Entering {agent_name}")

        userdata: UserData = self.session.userdata
        if userdata.ctx and userdata.ctx.room:
            await userdata.ctx.room.local_participant.set_attributes({"agent": agent_name})

        # Create a personalized prompt based on patient identification
        custom_instructions = self.instructions
        if userdata.is_identified():
            custom_instructions += f"\n\nYou are speaking with {userdata.name} (Phone: {userdata.phone})."

        chat_ctx = self.chat_ctx.copy()

        # Copy context from previous agent if it exists
        if userdata.prev_agent:
            items_copy = self._truncate_chat_ctx(
                userdata.prev_agent.chat_ctx.items, keep_function_call=True
            )
            existing_ids = {item.id for item in chat_ctx.items}
            items_copy = [item for item in items_copy if item.id not in existing_ids]
            chat_ctx.items.extend(items_copy)

        chat_ctx.add_message(
            role="system",
            content=f"You are the {agent_name}. {userdata.summarize()}"
        )
        await self.update_chat_ctx(chat_ctx)
        await self.session.say(self.get_greeting())
        self.session.generate_reply()

    def _truncate_chat_ctx(
        self,
        items: list,
        keep_last_n_messages: int = 6,
        keep_system_message: bool = False,
        keep_function_call: bool = False,
    ) -> list:
        """Truncate the chat context to keep the last n messages."""
        def _valid_item(item) -> bool:
            if not keep_system_message and item.type == "message" and item.role == "system":
                return False
            if not keep_function_call and item.type in ["function_call", "function_call_output"]:
                return False
            return True

        new_items = []
        for item in reversed(items):
            if _valid_item(item):
                new_items.append(item)
            if len(new_items) >= keep_last_n_messages:
                break
        new_items = new_items[::-1]

        while new_items and new_items[0].type in ["function_call", "function_call_output"]:
            new_items.pop(0)

        return new_items

    async def _transfer_to_agent(self, name: str, context: RunContext_T) -> Agent:
        """Transfer to another agent while preserving context."""
        userdata = context.userdata
        current_agent = context.session.current_agent
        next_agent = userdata.personas[name]
        userdata.prev_agent = current_agent
        return next_agent

    def get_greeting(self) -> str:
        """Return a language-specific greeting."""
        greetings = {
            "en": "I am Riya, a nurse assistant from Symbiosis Hospital.",
            "hi": "मैं सिम्बायोसिस अस्पताल से नर्स सहायक रिया हूँ।",
            "mr": "मी सिम्बायोसिस हॉस्पिटलची नर्स सहाय्यक रिया आहे।",
            "pa": "ਮੈਂ ਸਿਮਬਾਇਓਸਿਸ ਹਸਪਤਾਲ ਤੋਂ ਨਰਸ ਸਹਾਇਕ ਰੀਆ ਹਾਂ।",
            "ta": "நான் சிம்பயோசிஸ் மருத்துவமனையிலிருந்து செவிலியர் உதவியாளர் ரியா।",
            "te": "నేను సింబయోసిస్ హాస్పిటల్ నుండి నర్స్ అసిస్టెంట్ రియా。",
        }
        return greetings.get(self.session.userdata.language, greetings["en"])


class TriageAgent(BaseAgent):
    def __init__(self, language: str = "en") -> None:
        super().__init__(
            instructions=PROMPTS.get(language, PROMPTS["en"]),
            llm=groq.LLM(model="gemma2-9b-it", api_key=os.getenv("GROQ_API_KEY")),
            tts=self._get_tts(language),
            stt=self._get_stt(language),
            vad=silero.VAD.load(),
            turn_detection=MultilingualModel(),
        )
        self.language = language

    def _get_tts(self, language: str):
        """Return the appropriate TTS factory for the language."""
        tts_factories = {
            "en": lambda: deepgram.TTS(model="aura-asteria-en"),
            "hi": lambda: google.TTS(language="hi-IN", gender="female", voice_name="hi-IN-Wavenet-A"),
            "mr": lambda: google.TTS(language="mr-IN", gender="female", voice_name="mr-IN-Wavenet-A"),
            "pa": lambda: google.TTS(language="pa-IN", gender="female", voice_name="pa-IN-Wavenet-A"),
            "ta": lambda: google.TTS(language="ta-IN", gender="female", voice_name="ta-IN-Wavenet-A"),
            # "te": lambda: playai.TTS(language="te-IN", gender="female", voice_name="te-IN-Wavenet-A"),
        }
        return tts_factories.get(language, tts_factories["en"])()

    def _get_stt(self, language: str):
        """Return the appropriate STT factory for the language."""
        stt_factories = {
            "en": lambda: groq.STT(model="whisper-large-v3-turbo", language="en"),
            "hi": lambda: groq.STT(model="whisper-large-v3-turbo", language="hi"),
            "mr": lambda: groq.STT(model="whisper-large-v3-turbo", language="mr"),
            "pa": lambda: groq.STT(model="whisper-large-v3-turbo", language="pa"),
            "ta": lambda: groq.STT(model="whisper-large-v3-turbo", language="ta"),
            # "te": lambda: groq.STT(model="whisper-large-v3-turbo", language="te"),
        }
        return stt_factories.get(language, stt_factories["en"])()

    @function_tool
    async def identify_patient(self, name: str, phone: str, email: str):
        """Identify a patient by their name, phone, and email."""
        userdata: UserData = self.session.userdata
        if not re.match(r'^(?:\+91[-\s]?)?[6789]\d{9}$', phone):
            return "Please provide a valid phone number (e.g., +919876543210)."
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return "Please provide a valid email address (e.g., example@domain.com)."

        result, error = db.create_patient(name, phone, email, None, None)
        if result is None:
            return f"Failed to register patient: {error}"

        userdata.name = name
        userdata.phone = phone
        userdata.email = email
        userdata.patient_id = result.id

        return f"Thank you, {name}. I've registered your details."

    @function_tool
    async def transfer_to_booking(self, context: RunContext_T) -> Agent:
        userdata: UserData = self.session.userdata
        message = (
            f"Thank you, {userdata.name}. I'll transfer you to our Booking assistant to schedule an appointment."
            if userdata.is_identified()
            else "I'll transfer you to our Booking assistant to schedule an appointment."
        )
        await self.session.say(message)
        return await self._transfer_to_agent("booking", context)

    @function_tool
    async def transfer_to_support(self, context: RunContext_T) -> Agent:
        userdata: UserData = self.session.userdata
        message = (
            f"Thank you, {userdata.name}. I'll transfer you to our Support assistant for further assistance."
            if userdata.is_identified()
            else "I'll transfer you to our Support assistant for further assistance."
        )
        await self.session.say(message)
        return await self._transfer_to_agent("support", context)


class BookingAgent(BaseAgent):
    def __init__(self, language: str = "en") -> None:
        super().__init__(
            instructions=PROMPTS.get(language, PROMPTS["en"]),
            llm=groq.LLM(model="gemma2-9b-it", api_key=os.getenv("GROQ_API_KEY")),
            tts=self._get_tts(language),
            stt=self._get_stt(language),
            vad=silero.VAD.load(),
            turn_detection=MultilingualModel(),
        )
        self.language = language

    def _get_tts(self, language: str):
        """Return the appropriate TTS factory for the language."""
        tts_factories = {
            "en": lambda: deepgram.TTS(model="aura-asteria-en"),
            "hi": lambda: google.TTS(language="hi-IN", gender="female", voice_name="hi-IN-Wavenet-A"),
            "mr": lambda: google.TTS(language="mr-IN", gender="female", voice_name="mr-IN-Wavenet-A"),
            "pa": lambda: google.TTS(language="pa-IN", gender="female", voice_name="pa-IN-Wavenet-A"),
            "ta": lambda: google.TTS(language="ta-IN", gender="female", voice_name="ta-IN-Wavenet-A"),
            "te": lambda: google.TTS(language="te-IN", gender="female", voice_name="te-IN-Wavenet-A"),
        }
        return tts_factories.get(language, tts_factories["en"])()

    def _get_stt(self, language: str):
        """Return the appropriate STT factory for the language."""
        stt_factories = {
            "en": lambda: groq.STT(model="whisper-large-v3-turbo", language="en"),
            "hi": lambda: groq.STT(model="whisper-large-v3-turbo", language="hi"),
            "mr": lambda: groq.STT(model="whisper-large-v3-turbo", language="mr"),
            "pa": lambda: groq.STT(model="whisper-large-v3-turbo", language="pa"),
            "ta": lambda: groq.STT(model="whisper-large-v3-turbo", language="ta"),
            "te": lambda: groq.STT(model="whisper-large-v3-turbo", language="te"),
        }
        return stt_factories.get(language, stt_factories["en"])()

    @function_tool
    async def identify_patient(self, name: str, phone: str, email: str):
        """Identify a patient by their name, phone, and email."""
        userdata: UserData = self.session.userdata
        if not re.match(r'^(?:\+91[-\s]?)?[6789]\d{9}$', phone):
            return "Please provide a valid phone number (e.g., +919876543210)."
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return "Please provide a valid email address (e.g., example@domain.com)."

        result, error = db.create_patient(name, phone, email, None, None)
        if result is None:
            return f"Failed to register patient: {error}"

        userdata.name = name
        userdata.phone = phone
        userdata.email = email
        userdata.patient_id = result.id

        return f"Thank you, {name}. I've registered your details."

    @function_tool
    async def book_appointment(self, specialty: str, preferred_date: str, preferred_time: str):
        """Book an appointment for a patient with a specific specialty."""
        userdata: UserData = self.session.userdata
        if not userdata.is_identified():
            return "Please identify the patient first using the identify_patient function."

        result, error = db.create_booking(userdata.patient_id, specialty, preferred_date, preferred_time)
        if result is None:
            return f"Failed to book appointment: {error}"

        booking = result
        email_sent = self._send_confirmation_email(userdata.email, booking)
        userdata.current_booking = None

        if email_sent:
            return (
                f"Great! Your appointment (#{booking.id}) has been confirmed for {preferred_date} at {preferred_time} "
                f"with a {specialty}. You'll receive a confirmation email."
            )
        return (
            f"Great! Your appointment (#{booking.id}) has been confirmed for {preferred_date} at {preferred_time} "
            f"with a {specialty}. However, there was an issue sending the confirmation email. "
            f"Please check your email later or contact us if you don’t receive it."
        )

    @function_tool
    async def view_appointments(self, phone: str):
        """View upcoming appointments for a patient by phone number."""
        bookings = db.get_upcoming_bookings_by_phone(phone)
        if not bookings:
            return "You have no upcoming appointments."
        appointment_list = "\n".join([
            f"- Appointment #{booking.id} with {booking.specialty} on {booking.preferred_date} at {booking.preferred_time}"
            for booking in bookings
        ])
        return f"You have the following upcoming appointments:\n{appointment_list}"

    @function_tool
    async def update_appointment(
        self,
        booking_id: int,
        new_date: Optional[str] = None,
        new_time: Optional[str] = None,
        new_specialty: Optional[str] = None,
    ):
        """Update an existing appointment by booking ID."""
        success = db.update_booking(booking_id, new_date, new_time, new_specialty)
        if success:
            return "Appointment updated successfully."
        return "Failed to update appointment. Please check the booking ID and provided details."

    @function_tool
    async def cancel_appointment(self, booking_id: int):
        """Cancel an appointment by booking ID."""
        success = db.cancel_booking(booking_id)
        if success:
            return "Appointment canceled successfully."
        return "Failed to cancel appointment. Please check the booking ID."

    @function_tool
    async def transfer_to_triage(self, context: RunContext_T) -> Agent:
        userdata: UserData = self.session.userdata
        message = (
            f"Thank you, {userdata.name}. I'll transfer you back to our Triage assistant for further assistance."
            if userdata.is_identified()
            else "I'll transfer you back to our Triage assistant for further assistance."
        )
        await self.session.say(message)
        return await self._transfer_to_agent("triage", context)

    @function_tool
    async def transfer_to_support(self, context: RunContext_T) -> Agent:
        userdata: UserData = self.session.userdata
        message = (
            f"Thank you, {userdata.name}. I'll transfer you to our Support assistant for further assistance."
            if userdata.is_identified()
            else "I'll transfer you to our Support assistant for further assistance."
        )
        await self.session.say(message)
        return await self._transfer_to_agent("support", context)

    def _send_confirmation_email(self, patient_email: str, booking) -> bool:
        """Send a confirmation email for the appointment."""
        try:
            email_sender = os.getenv("EMAIL_SENDER")
            email_password = os.getenv("EMAIL_PASSWORD")
            if not email_sender or not email_password:
                logger.error("Email credentials are missing in the environment variables.")
                return False

            msg = EmailMessage()
            msg['Subject'] = "Appointment Reminder"
            msg['From'] = email_sender
            msg['To'] = patient_email
            msg.set_content(
                f"Hello {self.session.userdata.name}, your appointment is scheduled for "
                f"{booking.preferred_date} at {booking.preferred_time} with a {booking.specialty}."
            )

            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(email_sender, email_password)
                server.send_message(msg)

            logger.info(f"Confirmation email sent to {patient_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {patient_email}: {e}")
            return False


class SupportAgent(BaseAgent):
    def __init__(self, language: str = "en") -> None:
        super().__init__(
            instructions=PROMPTS.get(language, PROMPTS["en"]),
            llm=groq.LLM(model="compound-beta", api_key=os.getenv("GROQ_API_KEY")),
            tts=self._get_tts(language),
            stt=self._get_stt(language),
            vad=silero.VAD.load(),
            turn_detection=MultilingualModel(),
        )
        self.language = language

    def _get_tts(self, language: str):
        """Return the appropriate TTS factory for the language."""
        tts_factories = {
            "en": lambda: deepgram.TTS(model="aura-asteria-en"),
            "hi": lambda: google.TTS(language="hi-IN", gender="female", voice_name="hi-IN-Wavenet-A"),
            "mr": lambda: google.TTS(language="mr-IN", gender="female", voice_name="mr-IN-Wavenet-A"),
            "pa": lambda: google.TTS(language="pa-IN", gender="female", voice_name="pa-IN-Wavenet-A"),
            "ta": lambda: google.TTS(language="ta-IN", gender="female", voice_name="ta-IN-Wavenet-A"),
            "te": lambda: google.TTS(language="te-IN", gender="female", voice_name="te-IN"),
        }
        return tts_factories.get(language, tts_factories["en"])()

    def _get_stt(self, language: str):
        """Return the appropriate STT factory for the language."""
        stt_factories = {
            "en": lambda: groq.STT(model="whisper-large-v3-turbo", language="en"),
            "hi": lambda: groq.STT(model="whisper-large-v3-turbo", language="hi"),
            "mr": lambda: groq.STT(model="whisper-large-v3-turbo", language="mr"),
            "pa": lambda: groq.STT(model="whisper-large-v3-turbo", language="pa"),
            "ta": lambda: groq.STT(model="whisper-large-v3-turbo", language="ta"),
            "te": lambda: groq.STT(model="whisper-large-v3-turbo", language="te"),
        }
        return stt_factories.get(language, stt_factories["en"])()

    @function_tool
    async def identify_patient(self, name: str, phone: str, email: str):
        """Identify a patient by their name, phone, and email."""
        userdata: UserData = self.session.userdata
        if not re.match(r'^(?:\+91[-\s]?)?[6789]\d{9}$', phone):
            return "Please provide a valid phone number (e.g., +919876543210)."
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return "Please provide a valid email address (e.g., example@domain.com)."

        result, error = db.create_patient(name, phone, email, None, None)
        if result is None:
            return f"Failed to register patient: {error}"

        userdata.name = name
        userdata.phone = phone
        userdata.email = email
        userdata.patient_id = result.id

        return f"Thank you, {name}. I've registered your details."

    @function_tool
    async def check_insurance(self, phone: str):
        """Check if a patient has health insurance by phone number."""
        result = db.check_insurance_eligibility(phone)
        return result["message"]

    @function_tool
    async def submit_insurance_claim(self, phone: str, claim_amount: float):
        """Submit an insurance claim for a patient."""
        userdata: UserData = self.session.userdata
        eligibility = db.check_insurance_eligibility(phone)
        if not eligibility["eligible"]:
            return eligibility["message"]

        patient_id = eligibility["patient_id"]
        insurance_provider = eligibility["insurance_provider"]
        insurance_number = eligibility["insurance_number"]

        result, error = db.submit_insurance_claim(patient_id, insurance_provider, insurance_number, claim_amount)
        if result is None:
            return f"Failed to submit claim: {error}"

        return f"Insurance claim #{result.id} submitted for {claim_amount} INR. Status: {result.status}."

    @function_tool
    async def get_medicine_info(self, name: str):
        """Get information about a specific medicine."""
        medicine = db.get_medicine_info(name)
        if not medicine:
            return f"No information found for medicine: {name}"
        return (
            f"Medicine: {medicine['name']}\n"
            f"Description: {medicine['description']}\n"
            f"Side Effects: {medicine['side_effects']}"
        )

    @function_tool
    async def suggest_specialist(self, symptoms: str):
        """Suggest a specialist based on symptoms."""
        specialties = db.get_specialties_for_symptoms(symptoms)
        if not specialties:
            return "I'm not sure which specialist to suggest. Please provide more details or consider seeing a General Physician."

        specialty = specialties[0]
        doctors = db.get_doctors_by_specialty(specialty)
        if not doctors:
            return f"No doctors available for {specialty}."

        doctor_names = ", ".join([f"Dr. {doctor.name}" for doctor in doctors])
        return f"Based on your symptoms, I suggest seeing a {specialty}, such as {doctor_names}."

    @function_tool
    async def transfer_to_triage(self, context: RunContext_T) -> Agent:
        userdata: UserData = self.session.userdata
        message = (
            f"Thank you, {userdata.name}. I'll transfer you back to our Triage assistant for further assistance."
            if userdata.is_identified()
            else "I'll transfer you back to our Triage assistant for further assistance."
        )
        await self.session.say(message)
        return await self._transfer_to_agent("triage", context)

    @function_tool
    async def transfer_to_booking(self, context: RunContext_T) -> Agent:
        userdata: UserData = self.session.userdata
        message = (
            f"Thank you, {userdata.name}. I'll transfer you to our Booking assistant to schedule an appointment."
            if userdata.is_identified()
            else "I'll transfer you to our Booking assistant to schedule an appointment."
        )
        await self.session.say(message)
        return await self._transfer_to_agent("booking", context)


async def entrypoint(ctx: JobContext):
    await ctx.connect()

    # Wait for a participant to join
    while len(ctx.room.remote_participants) < 1:
        await asyncio.sleep(0.1)

    user_participant = next(iter(ctx.room.remote_participants.values()))
    language = user_participant.metadata or "en"

    logger.info(f"Job {ctx.job.id} received for language: {language}")

    # Initialize user data with context and language
    userdata = UserData(ctx=ctx, language=language)

    # Create agent instances
    triage_agent = TriageAgent(language=language)
    booking_agent = BookingAgent(language=language)
    support_agent = SupportAgent(language=language)

    # Register all agents in the userdata
    userdata.personas.update({
        "triage": triage_agent,
        "booking": booking_agent,
        "support": support_agent,
    })

    # Create session with userdata
    session = AgentSession[UserData](userdata=userdata)

    # Start the session with the triage agent
    await session.start(
        agent=triage_agent,
        room=ctx.room,
    )

    # Placeholder for metrics collection (to be implemented based on LiveKit documentation)
    async def log_usage():
        logger.info(f"Job {ctx.job.id}: Metrics collection placeholder")
        # TODO: Implement metrics collection using livekit.agents.metrics
        # Example: usage_collector_instance = usage_collector.UsageCollector()
        # summary = usage_collector_instance.get_summary()

    ctx.add_shutdown_callback(log_usage)
    logger.info(f"Job {ctx.job.id}: Shutdown callback added")

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))