interface TeacherActionsProps {
  teacher: {
    name: string;
    videoProfileUrl?: string;
  };
}

export default function TeacherActions({ teacher }: TeacherActionsProps) {
  // This component is now empty as the actions have been moved to the header
  // We're keeping the component for now in case additional actions need to be added later
  return null;
}
