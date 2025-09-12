
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PowerCycleVsBarreEnhancedFilterSection } from './PowerCycleVsBarreEnhancedFilterSection';
import { PowerCycleVsBarreComparison } from './PowerCycleVsBarreComparison';
import { PowerCycleVsBarreCharts } from './PowerCycleVsBarreCharts';
import { PowerCycleVsBarreTopBottomLists } from './PowerCycleVsBarreTopBottomLists';
import { DrillDownModal } from './DrillDownModal';
import { SourceDataModal } from '@/components/ui/SourceDataModal';
import { useFilteredSessionsData } from '@/hooks/useFilteredSessionsData';
import { useSessionsData } from '@/hooks/useSessionsData';
import { RefinedLoader } from '@/components/ui/RefinedLoader';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { TrendingUp, BarChart3, Activity, Users, Eye } from 'lucide-react';
import { getPreviousMonthDateRange } from '@/utils/dateUtils';

export const PowerCycleVsBarreSection: React.FC = () => {
  const { setLoading } = useGlobalLoading();
  const { data: rawData, loading, error } = useSessionsData();
  const filteredData = useFilteredSessionsData(rawData);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [showSourceData, setShowSourceData] = useState(false);

  React.useEffect(() => {
    setLoading(loading, 'Loading PowerCycle vs Barre comparison data...');
  }, [loading, setLoading]);

  // Filter for PowerCycle and Barre classes only
  const powerCycleVsBarreData = React.useMemo(() => {
    if (!filteredData) return [];
    
    return filteredData.filter(session => {
      const className = session.cleanedClass?.toLowerCase() || '';
      return className.includes('powercycle') || className.includes('barre');
    });
  }, [filteredData]);

  // Separate PowerCycle and Barre data
  const powerCycleData = React.useMemo(() => {
    return powerCycleVsBarreData.filter(session => {
      const className = session.cleanedClass?.toLowerCase() || '';
      return className.includes('powercycle');
    });
  }, [powerCycleVsBarreData]);

  const barreData = React.useMemo(() => {
    return powerCycleVsBarreData.filter(session => {
      const className = session.cleanedClass?.toLowerCase() || '';
      return className.includes('barre');
    });
  }, [powerCycleVsBarreData]);

  // Calculate metrics for comparison
  const powerCycleMetrics = React.useMemo(() => {
    const totalSessions = powerCycleData.length;
    const totalAttendance = powerCycleData.reduce((sum, session) => sum + ((session as any).attended || 0), 0);
    const totalCapacity = powerCycleData.reduce((sum, session) => sum + ((session as any).capacity || 0), 0);
    const totalBookings = powerCycleData.reduce((sum, session) => sum + ((session as any).booked || 0), 0);
    const emptySessions = powerCycleData.filter(session => ((session as any).attended || 0) === 0).length;
    const avgFillRate = totalCapacity > 0 ? (totalAttendance / totalCapacity) * 100 : 0;
    const avgSessionSize = totalSessions > 0 ? totalAttendance / totalSessions : 0;
    const sessionsWithAttendance = powerCycleData.filter(session => ((session as any).attended || 0) > 0);
    const avgSessionSizeExclEmpty = sessionsWithAttendance.length > 0 ? 
      sessionsWithAttendance.reduce((sum, session) => sum + ((session as any).attended || 0), 0) / sessionsWithAttendance.length : 0;
    const noShows = powerCycleData.reduce((sum, session) => sum + Math.max(0, ((session as any).booked || 0) - ((session as any).attended || 0)), 0);

    return {
      totalSessions,
      totalAttendance,
      totalCapacity,
      totalBookings,
      emptySessions,
      avgFillRate,
      avgSessionSize,
      avgSessionSizeExclEmpty,
      noShows
    };
  }, [powerCycleData]);

  const barreMetrics = React.useMemo(() => {
    const totalSessions = barreData.length;
    const totalAttendance = barreData.reduce((sum, session) => sum + ((session as any).attended || 0), 0);
    const totalCapacity = barreData.reduce((sum, session) => sum + ((session as any).capacity || 0), 0);
    const totalBookings = barreData.reduce((sum, session) => sum + ((session as any).booked || 0), 0);
    const emptySessions = barreData.filter(session => ((session as any).attended || 0) === 0).length;
    const avgFillRate = totalCapacity > 0 ? (totalAttendance / totalCapacity) * 100 : 0;
    const avgSessionSize = totalSessions > 0 ? totalAttendance / totalSessions : 0;
    const sessionsWithAttendance = barreData.filter(session => ((session as any).attended || 0) > 0);
    const avgSessionSizeExclEmpty = sessionsWithAttendance.length > 0 ? 
      sessionsWithAttendance.reduce((sum, session) => sum + ((session as any).attended || 0), 0) / sessionsWithAttendance.length : 0;
    const noShows = barreData.reduce((sum, session) => sum + Math.max(0, ((session as any).booked || 0) - ((session as any).attended || 0)), 0);

    return {
      totalSessions,
      totalAttendance,
      totalCapacity,
      totalBookings,
      emptySessions,
      avgFillRate,
      avgSessionSize,
      avgSessionSizeExclEmpty,
      noShows
    };
  }, [barreData]);

  const handleItemClick = (item: any) => {
    setDrillDownData(item);
  };

  if (loading) {
    return <RefinedLoader subtitle="Loading PowerCycle vs Barre analysis..." />;
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <p className="text-red-600">Error loading data: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Filter Section */}
      <PowerCycleVsBarreEnhancedFilterSection data={rawData || []} />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-4">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="overview" className="text-sm font-medium">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                Comparison
              </TabsTrigger>
              <TabsTrigger value="charts" className="text-sm font-medium">
                <Activity className="w-4 h-4 mr-2" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-sm font-medium">
                <Users className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="detailed" className="text-sm font-medium">
                <Eye className="w-4 h-4 mr-2" />
                Detailed View
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value="overview" className="space-y-8">
          <PowerCycleVsBarreComparison powerCycleMetrics={powerCycleMetrics} barreMetrics={barreMetrics} />
          <PowerCycleVsBarreCharts powerCycleData={powerCycleData as any} barreData={barreData as any} />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-8">
          <PowerCycleVsBarreComparison powerCycleMetrics={powerCycleMetrics} barreMetrics={barreMetrics} />
        </TabsContent>

        <TabsContent value="charts" className="space-y-8">
          <PowerCycleVsBarreCharts powerCycleData={powerCycleData as any} barreData={barreData as any} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-8">
          <PowerCycleVsBarreTopBottomLists 
            powerCycleData={powerCycleData as any}
            barreData={barreData as any}
            onItemClick={handleItemClick} 
          />
        </TabsContent>

        <TabsContent value="detailed" className="space-y-8">
          <div className="text-center p-8">
            <p className="text-gray-600">Detailed data table coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {drillDownData && (
        <DrillDownModal
          isOpen={!!drillDownData}
          onClose={() => setDrillDownData(null)}
          data={drillDownData}
          type="trainer"
        />
      )}

      {showSourceData && (
        <SourceDataModal
          open={showSourceData}
          onOpenChange={setShowSourceData}
          sources={[
            {
              name: "PowerCycle vs Barre Sessions",
              data: powerCycleVsBarreData
            }
          ]}
        />
      )}
    </div>
  );
};
