import { motion, AnimatePresence } from "framer-motion";

<AnimatePresence>
  {showDetails && (
    <motion.div
      initial={{ opacity: 0, maxHeight: 0 }}
      animate={{ opacity: 1, maxHeight: 1000 }} // Use a large maxHeight value
      exit={{ opacity: 0, maxHeight: 0 }}
      transition={{ duration: 0.5 }}
      className="additional-details"
    >
      {/* Content goes here */}
      <ProductDescription />
      <UserInstructions />
    </motion.div>
  )}
</AnimatePresence>