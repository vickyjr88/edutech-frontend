
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

type VideoStepProps = {
  videoUrl: string;
  setVideoUrl: React.Dispatch<React.SetStateAction<string>>;
};

const VideoStep = ({ videoUrl, setVideoUrl }: VideoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <h3 className="font-medium">Upload or Record Video</h3>
          <p className="text-sm text-gray-500">
            Upload a 1-2 minute video introducing yourself to potential students
          </p>
          <Button variant="outline" className="mt-2">
            Choose File
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="video-url">Or Provide a YouTube/Vimeo URL</Label>
        <Input 
          id="video-url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="e.g., https://youtube.com/watch?v=..."
        />
      </div>
    </div>
  );
};

export default VideoStep;
