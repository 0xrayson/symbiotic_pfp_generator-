"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Download, RotateCcw } from "lucide-react"

export function PfpGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setOriginalImage(imageUrl)
      processImage(imageUrl)
    }
    reader.readAsDataURL(file)
  }, [])

  const processImage = useCallback(async (imageUrl: string) => {
    setIsProcessing(true)

    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        // Set canvas size with border
        const borderWidth = 20
        const size = 400
        canvas.width = size + borderWidth * 2
        canvas.height = size + borderWidth * 2

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw border
        ctx.fillStyle = "#D1E77B"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Create circular clipping path for the image
        ctx.save()
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2)
        ctx.clip()

        // Calculate image dimensions to maintain aspect ratio
        const imgAspect = img.width / img.height
        let drawWidth = size
        let drawHeight = size
        let drawX = borderWidth
        let drawY = borderWidth

        if (imgAspect > 1) {
          // Image is wider than tall
          drawHeight = size / imgAspect
          drawY = borderWidth + (size - drawHeight) / 2
        } else {
          // Image is taller than wide
          drawWidth = size * imgAspect
          drawX = borderWidth + (size - drawWidth) / 2
        }

        // Draw the image
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        ctx.restore()

        // Convert to data URL
        const processedDataUrl = canvas.toDataURL("image/png", 1.0)
        setProcessedImage(processedDataUrl)
        setIsProcessing(false)
      }

      img.src = imageUrl
    } catch (error) {
      console.error("Error processing image:", error)
      setIsProcessing(false)
    }
  }, [])

  const handleDownload = useCallback(() => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.download = "symbiotic-pfp.png"
    link.href = processedImage
    link.click()
  }, [processedImage])

  const handleReset = useCallback(() => {
    setOriginalImage(null)
    setProcessedImage(null)
    setIsProcessing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Your PFP</h3>
                <p className="text-muted-foreground text-sm">Choose an image file to add the symbiotic border</p>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

              <Button onClick={() => fileInputRef.current?.click()} className="mb-4" size="lg">
                Choose Image
              </Button>

              {originalImage && (
                <div className="mt-6">
                  <img
                    src={originalImage || "/placeholder.svg"}
                    alt="Original"
                    className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-border"
                  />
                  <p className="text-sm text-muted-foreground mt-2">Original Image</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Download className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your Symbiotic PFP</h3>
                <p className="text-muted-foreground text-sm">Download your enhanced profile picture</p>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2 text-muted-foreground">Processing...</span>
                </div>
              )}

              {processedImage && !isProcessing && (
                <div className="space-y-4">
                  <img
                    src={processedImage || "/placeholder.svg"}
                    alt="Processed PFP"
                    className="w-48 h-48 mx-auto rounded-full shadow-lg"
                  />
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleDownload} size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Download PFP
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="lg">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              {!originalImage && !isProcessing && (
                <div className="py-8 text-muted-foreground">Upload an image to see your symbiotic PFP here</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
