import { Check, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ComparisonTable = () => {
  const features = [
    { name: "AI Chat Interface", solo: true, enterprise: true, custom: true },
    { name: "Voice Assistant", solo: "English only", enterprise: "5 languages", custom: "Custom languages" },
    { name: "Knowledge Base", solo: "Basic", enterprise: "Advanced", custom: "Custom" },
    { name: "SQL Integration", solo: false, enterprise: true, custom: true },
    { name: "API Access", solo: false, enterprise: true, custom: true },
    { name: "Custom Model Training", solo: false, enterprise: false, custom: true },
    { name: "Monthly Queries", solo: "100", enterprise: "Unlimited", custom: "Unlimited" },
    { name: "Support", solo: "Email", enterprise: "Priority", custom: "Dedicated" },
    { name: "SLA Guarantee", solo: false, enterprise: false, custom: true },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">Feature Comparison</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Feature</TableHead>
              <TableHead className="text-center">Solo</TableHead>
              <TableHead className="text-center">Enterprise</TableHead>
              <TableHead className="text-center">Custom</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.name}>
                <TableCell className="font-medium">{feature.name}</TableCell>
                <TableCell className="text-center">
                  {typeof feature.solo === "boolean" ? (
                    feature.solo ? (
                      <Check className="h-5 w-5 mx-auto text-green-500" />
                    ) : (
                      <X className="h-5 w-5 mx-auto text-red-500" />
                    )
                  ) : (
                    feature.solo
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {typeof feature.enterprise === "boolean" ? (
                    feature.enterprise ? (
                      <Check className="h-5 w-5 mx-auto text-green-500" />
                    ) : (
                      <X className="h-5 w-5 mx-auto text-red-500" />
                    )
                  ) : (
                    feature.enterprise
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {typeof feature.custom === "boolean" ? (
                    feature.custom ? (
                      <Check className="h-5 w-5 mx-auto text-green-500" />
                    ) : (
                      <X className="h-5 w-5 mx-auto text-red-500" />
                    )
                  ) : (
                    feature.custom
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ComparisonTable
