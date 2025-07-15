import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function RulesPage() {
  return (
    <Tabs defaultValue="yara">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="yara">YARA Rules</TabsTrigger>
        <TabsTrigger value="sysmon">Sysmon Configuration</TabsTrigger>
      </TabsList>
      <TabsContent value="yara">
        <Card>
          <CardHeader>
            <CardTitle>YARA Rule Management</CardTitle>
            <CardDescription>
              Create, edit, and manage your library of YARA rules for remote
              scanning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[400px] font-mono"
              placeholder="/* Your YARA rule goes here */"
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sysmon">
        <Card>
          <CardHeader>
            <CardTitle>Sysmon Configuration Management</CardTitle>
            <CardDescription>
              Edit, version, and deploy your master Sysmon configuration to
              agents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[400px] font-mono"
              placeholder="<!-- Your Sysmon XML configuration goes here -->"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
