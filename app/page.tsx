"use client"

import { useState } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function FileUploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Upload successful",
        description: `${files.length} file(s) have been uploaded.`,
      })
      setFiles([])
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex  flex-col items-center justify-center py-8 md:py-12">
      <section className="w-full max-w-4xl space-y-8 px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl text-primary">File Upload</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Upload your files for quantum processing and analysis.
          </p>
        </div>

        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-secondary">Upload Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md space-y-2">
                <Label htmlFor="file-upload" className="text-center block">Select files</Label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    className="cursor-pointer w-full"
                  />
                  <Button 
                    onClick={handleUpload}
                    disabled={isUploading || files.length === 0}
                    className="w-full sm:w-auto"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {files.length > 0 && (
                <div className="w-full max-w-md space-y-2">
                  <h3 className="font-medium text-center">Selected Files</h3>
                  <div className="border rounded-lg divide-y">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center p-3 gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate flex-1">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}