
"use client"
import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import type { RuleFile } from "@/lib/types"

export function FileTree({ 
  title, 
  files,
  selectedFile,
  onSelectFile
}: { 
  title: string, 
  files: RuleFile[],
  selectedFile: string,
  onSelectFile: (id: string) => void
}) {

  return (
    <Card className="h-full">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-1">
          {files.map((file) => (
             <Button
                key={file.id}
                variant={selectedFile === file.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectFile(file.id)}
              >
                <FileText className="mr-2 h-4 w-4" />
                {file.name}
              </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
