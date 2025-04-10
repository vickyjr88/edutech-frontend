
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type LeaderboardEntryType = {
  id: number;
  rank: number;
  name: string;
  avatar?: string;
  grade: string;
  points: number;
  achievements: number;
  streak: number;
};

interface LeaderboardTableProps {
  entries: LeaderboardEntryType[];
  currentUserId?: number;
}

const LeaderboardTable = ({ entries, currentUserId }: LeaderboardTableProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="font-semibold text-gray-600">{rank}</span>;
    }
  };

  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-16 text-center">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-center hidden md:table-cell">Achievements</TableHead>
                <TableHead className="text-center hidden md:table-cell">Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow 
                  key={entry.id}
                  className={`${currentUserId === entry.id ? "bg-blue-50" : ""} hover:bg-gray-50`}
                >
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center h-8">
                      {getRankIcon(entry.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-gray-200">
                        {entry.avatar ? (
                          <AvatarImage src={entry.avatar} alt={entry.name} />
                        ) : (
                          <AvatarFallback className="bg-kidato-blue text-white text-xs">
                            {entry.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-xs text-gray-500">{entry.grade}</div>
                      </div>
                      {currentUserId === entry.id && (
                        <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">You</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">{entry.points}</span>
                    <span className="text-xs text-gray-500 ml-1">pts</span>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <div className="flex items-center justify-center">
                      <Award className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{entry.achievements}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <Badge className={entry.streak >= 7 ? "bg-green-100 text-green-700" : ""}>
                      {entry.streak} days
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
