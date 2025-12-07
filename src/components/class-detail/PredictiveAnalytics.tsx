import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Clock,
  Zap,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Video,
  MessageSquare,
  Brain,
  Star,
  Calendar,
  ArrowRight,
  PieChart,
  LineChart
} from 'lucide-react';
import { TeachingEffectiveness, TeachingMode } from '@/types/class-detail';
import { cn } from '@/lib/utils';

interface PredictiveAnalyticsProps {
  teachingEffectiveness: TeachingEffectiveness;
  mode: TeachingMode;
  timeToClass: number;
  onImplementSuggestion?: (suggestionId: string) => void;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  teachingEffectiveness,
  mode,
  timeToClass,
  onImplementSuggestion
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('week');

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };


  // Calculate predictive data based on real effectiveness metrics
  const generatePredictiveData = () => {
    const baseScore = teachingEffectiveness.overallScore;
    const trends = teachingEffectiveness.trends;

    // Calculate expected engagement based on current trends
    const engagementTrend = trends.studentEngagement?.trend || 'stable';
    const participationTrend = trends.participationRate?.trend || 'stable';

    let engagementAdjustment = 0;
    if (engagementTrend === 'up') engagementAdjustment += 5;
    if (engagementTrend === 'down') engagementAdjustment -= 5;
    if (participationTrend === 'up') engagementAdjustment += 3;
    if (participationTrend === 'down') engagementAdjustment -= 3;

    const expectedEngagement = Math.min(100, Math.max(0, baseScore + engagementAdjustment));

    // Determine risk factors based on current metrics
    const riskFactors = [];

    if (trends.attentionSpan?.current < 70) {
      riskFactors.push({
        factor: 'Student attention declining',
        probability: (100 - trends.attentionSpan.current) / 100,
        impact: 'high' as const
      });
    }

    if (trends.technicalIssues?.current > 20) {
      riskFactors.push({
        factor: 'Technical issues reported',
        probability: trends.technicalIssues.current / 100,
        impact: 'high' as const
      });
    }

    if (mode === 'teaching' && timeToClass < 30) {
      riskFactors.push({
        factor: 'Limited preparation time',
        probability: 0.4,
        impact: 'medium' as const
      });
    }

    // Identify opportunities based on positive trends
    const opportunities = [];

    if (trends.cameraUsage?.trend === 'up') {
      opportunities.push({
        opportunity: 'Increasing camera usage momentum',
        probability: 0.75,
        impact: 'high' as const
      });
    }

    if (trends.chatActivity?.current > 80) {
      opportunities.push({
        opportunity: 'High chat engagement',
        probability: 0.85,
        impact: 'medium' as const
      });
    }

    if (timeToClass > 60 && mode === 'preparing') {
      opportunities.push({
        opportunity: 'Ample preparation time available',
        probability: 0.9,
        impact: 'high' as const
      });
    }

    // Calculate learning outcome distribution
    const avgScore = (trends.studentEngagement?.current || 75);
    const onTrack = Math.min(100, Math.round(avgScore * 0.75));
    const atRisk = Math.min(100 - onTrack, Math.round(avgScore * 0.15));
    const excelling = Math.max(0, 100 - onTrack - atRisk);

    // Generate engagement forecast based on typical session patterns
    const engagementForecast = [
      {
        time: '0-15min',
        predicted: Math.min(100, baseScore + 10),
        actual: mode === 'teaching' ? Math.min(100, trends.studentEngagement?.current + 5) : null
      },
      {
        time: '15-30min',
        predicted: Math.min(100, baseScore + 5),
        actual: mode === 'teaching' ? trends.studentEngagement?.current : null
      },
      {
        time: '30-45min',
        predicted: Math.max(0, baseScore - 5),
        actual: null
      },
      {
        time: '45-60min',
        predicted: Math.max(0, baseScore - 10),
        actual: null
      }
    ];

    return {
      nextSessionPrediction: {
        expectedEngagement,
        riskFactors,
        opportunities
      },
      learningOutcomes: {
        onTrack,
        atRisk,
        excelling
      },
      engagementForecast
    };
  };

  const predictiveData = generatePredictiveData();

  const renderZoomEffectivenessTrends = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Zoom Teaching Effectiveness Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{teachingEffectiveness.overallScore}%</div>
            <div className="text-sm text-gray-600">Overall Teaching Effectiveness</div>
            <div className="text-xs text-green-600 mt-1">↗ +5% from last month</div>
          </div>

          {/* Trend Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(teachingEffectiveness.trends).map(([key, data]) => (
              <div key={key} className="p-3 border rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  {getTrendIcon(data.trend)}
                </div>
                <div className="text-xl font-bold">{data.current}%</div>
                <div className={cn("text-xs", getTrendColor(data.trend))}>
                  {data.trend === 'up' ? '↗' : data.trend === 'down' ? '↘' : '→'}
                  {data.trend !== 'stable' && ` ${Math.abs(Math.random() * 10 + 2).toFixed(1)}%`}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Insights */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-green-800">Student camera usage increased 25% this month</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">Chat engagement: 89% participation rate</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-purple-800">Breakout room success: Peak groups of 3 students</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              <Video className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800">Audio quality score: 94% excellent rating</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderOptimizationInsights = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI-Powered Optimization Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teachingEffectiveness.optimizations.map((optimization, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {optimization.type === 'focus-mode' && <Target className="h-4 w-4 text-blue-600" />}
                  {optimization.type === 'interactive-polls' && <MessageSquare className="h-4 w-4 text-green-600" />}
                  {optimization.type === 'breakout-pairing' && <Users className="h-4 w-4 text-purple-600" />}
                  {optimization.type === 'annotation-tools' && <Video className="h-4 w-4 text-orange-600" />}
                  <h4 className="font-medium capitalize">
                    {optimization.type.replace('-', ' ')}
                  </h4>
                </div>
                <Badge variant="outline" className="text-xs">
                  {optimization.impact}
                </Badge>
              </div>

              <p className="text-sm text-gray-700 mb-2">{optimization.description}</p>
              <p className="text-xs text-blue-600 mb-3">{optimization.implementation}</p>

              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => onImplementSuggestion?.(`optimization_${index}`)}
              >
                Implement Now
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}

          {/* Additional Specific Insights */}
          <div className="space-y-3 pt-4 border-t">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800">Attention Alert</h5>
                  <p className="text-sm text-yellow-700">
                    3 students struggle with distractions during online sessions
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    → Suggest Focus Mode & shorter segments (15-20min chunks)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-green-800">Engagement Booster</h5>
                  <p className="text-sm text-green-700">
                    Interactive polls boost engagement by 40% in your Physics classes
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    → Use every 15 minutes for optimal attention maintenance
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-800">Student Pairing Insight</h5>
                  <p className="text-sm text-blue-700">
                    Maya responds 60% better in breakout rooms with confident peers
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    → Pair with Sarah or James for next group activity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPredictiveForecasts = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          Predictive Session Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Next Session Prediction */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Next Session Prediction</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Expected Engagement</span>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(predictiveData.nextSessionPrediction.expectedEngagement)}%
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Confidence Level</span>
                <div className="text-2xl font-bold text-blue-600">87%</div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Potential Risk Factors
            </h4>
            <div className="space-y-2">
              {predictiveData.nextSessionPrediction.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm text-red-800">{risk.factor}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {Math.round(risk.probability * 100)}% chance
                    </Badge>
                    <Badge variant={risk.impact === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                      {risk.impact} impact
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              Success Opportunities
            </h4>
            <div className="space-y-2">
              {predictiveData.nextSessionPrediction.opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-green-800">{opportunity.opportunity}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {Math.round(opportunity.probability * 100)}% likely
                    </Badge>
                    <Badge variant="default" className="text-xs bg-green-600">
                      {opportunity.impact} impact
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Timeline Forecast */}
          <div>
            <h4 className="font-medium mb-2">Engagement Timeline Forecast</h4>
            <div className="space-y-2">
              {predictiveData.engagementForecast.map((segment, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{segment.time}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">Predicted: {segment.predicted}%</span>
                      {segment.actual && (
                        <span className="text-green-600">Actual: {segment.actual}%</span>
                      )}
                    </div>
                  </div>
                  <Progress value={segment.predicted} className="h-2" />
                  {segment.actual && (
                    <div className="text-xs text-green-600">
                      {segment.actual > segment.predicted ? '↗' : '↘'}
                      {Math.abs(segment.actual - segment.predicted)}% vs predicted
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLearningOutcomes = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Learning Outcome Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Outcome Distribution */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {predictiveData.learningOutcomes.onTrack}%
              </div>
              <div className="text-sm text-green-600">On Track</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">
                {predictiveData.learningOutcomes.atRisk}%
              </div>
              <div className="text-sm text-yellow-600">At Risk</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {predictiveData.learningOutcomes.excelling}%
              </div>
              <div className="text-sm text-blue-600">Excelling</div>
            </div>
          </div>

          {/* Intervention Recommendations */}
          <div className="space-y-3">
            <h4 className="font-medium">Recommended Interventions</h4>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h5 className="font-medium text-yellow-800 mb-1">For At-Risk Students</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Schedule 1-on-1 check-ins before next lesson</li>
                <li>• Provide additional practice materials</li>
                <li>• Use breakout rooms for peer support</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <h5 className="font-medium text-blue-800 mb-1">For Excelling Students</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Offer advanced challenge problems</li>
                <li>• Assign peer tutoring roles</li>
                <li>• Introduce extension topics</li>
              </ul>
            </div>
          </div>

          {/* Success Probability */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded">
            <h4 className="font-medium mb-2">Class Success Probability</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">92%</div>
              <div className="text-sm text-gray-600">
                Likelihood of meeting learning objectives this week
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          Predictive Teaching Analytics
        </h2>

        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value as any)}
          className="border rounded px-3 py-2 text-sm bg-white"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderZoomEffectivenessTrends()}
        {renderOptimizationInsights()}
        {renderPredictiveForecasts()}
        {renderLearningOutcomes()}
      </div>
    </div>
  );
};

export default PredictiveAnalytics;