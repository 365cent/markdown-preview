"use client"

import { useState, useEffect } from "react"
import { Maximize2, Copy, FileText } from "lucide-react"
import { marked } from "marked"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    readingTime: 0,
  })

  useEffect(() => {
    // Calculate statistics
    const words = markdown.trim().split(/\s+/).length
    const chars = markdown.length
    const readingTime = Math.ceil(words / 200) // Assuming 200 words per minute

    setStats({
      words,
      chars,
      readingTime,
    })
  }, [markdown])

  const copyToClipboard = async (format: "markdown" | "html") => {
    const content = format === "markdown" ? markdown : marked(markdown)
    await navigator.clipboard.writeText(content)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Untitled Document.md</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>READING TIME: {stats.readingTime} MIN READ</span>
              <span>WORDS: {stats.words}</span>
              <span>CHARACTERS: {stats.chars}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard("markdown")}>
              <FileText className="mr-2 h-4 w-4" />
              Copy Markdown
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard("html")}>
              <Copy className="mr-2 h-4 w-4" />
              Copy HTML
            </Button>
          </div>
        </div>

        <Separator />

        {/* Editor */}
        <div className={`grid gap-4 ${isFullscreen ? "" : "md:grid-cols-2"}`}>
          <div className="relative">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="secondary">MARKDOWN</Badge>
              <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your markdown here..."
              className="min-h-[500px] font-mono"
            />
          </div>

          {!isFullscreen && (
            <div>
              <Badge variant="secondary" className="mb-2">
                PREVIEW
              </Badge>
              <div
                className="prose prose-gray dark:prose-invert max-w-none rounded-md border bg-card p-4 min-h-[500px]"
                dangerouslySetInnerHTML={{ __html: marked(markdown) }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

