import { useTasks } from "@/hooks/useTasks";
import TopNavbar from "@/components/TopNavbar";
import ProgressBar from "@/components/ProgressBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, parseISO, startOfWeek, addDays, isWithinInterval } from "date-fns";

const COLORS = {
  high: "hsl(0 72% 58%)",
  medium: "hsl(38 92% 56%)",
  low: "hsl(152 69% 47%)",
  todo: "hsl(215 20% 55%)",
  in_progress: "hsl(199 89% 57%)",
  completed: "hsl(152 69% 47%)",
};

export default function AnalyticsPage() {
  const { tasks, stats } = useTasks();

  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "high").length, color: COLORS.high },
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length, color: COLORS.medium },
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length, color: COLORS.low },
  ].filter((d) => d.value > 0);

  const statusData = [
    { name: "To Do", value: stats.todo, color: COLORS.todo },
    { name: "In Progress", value: stats.inProgress, color: COLORS.in_progress },
    { name: "Completed", value: stats.completed, color: COLORS.completed },
  ].filter((d) => d.value > 0);

  // Weekly task creation chart
  const weekStart = startOfWeek(new Date());
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i);
    const created = tasks.filter((t) =>
      isWithinInterval(parseISO(t.created_at), { start: day, end: addDays(day, 1) })
    ).length;
    const completed = tasks.filter(
      (t) =>
        t.status === "completed" &&
        isWithinInterval(parseISO(t.updated_at), { start: day, end: addDays(day, 1) })
    ).length;
    return { day: format(day, "EEE"), created, completed };
  });

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopNavbar />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Your productivity insights at a glance.</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Completion Rate", value: `${completionRate}%`, progress: completionRate, variant: "success" as const },
            { label: "Total Tasks", value: stats.total, progress: 100, variant: "primary" as const },
            { label: "In Progress", value: stats.inProgress, progress: stats.total ? (stats.inProgress / stats.total) * 100 : 0, variant: "info" as const },
            { label: "Pending", value: stats.todo, progress: stats.total ? (stats.todo / stats.total) * 100 : 0, variant: "warning" as const },
          ].map((kpi, i) => (
            <div key={kpi.label} className="bg-card border border-border rounded-2xl p-5 card-glow space-y-3 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <p className="text-muted-foreground text-sm font-medium">{kpi.label}</p>
              <p className="font-display text-3xl font-bold text-foreground">{kpi.value}</p>
              <ProgressBar value={kpi.progress} variant={kpi.variant} size="sm" />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly chart */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 card-glow">
            <h3 className="font-display font-semibold text-foreground">This Week's Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="created" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Created" />
                <Bar dataKey="completed" fill={COLORS.completed} radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary" /><span>Created</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: COLORS.completed }} /><span>Completed</span></div>
            </div>
          </div>

          {/* Pie charts */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "By Priority", data: priorityData },
              { title: "By Status", data: statusData },
            ].map((chart) => (
              <div key={chart.title} className="bg-card border border-border rounded-2xl p-5 card-glow space-y-3">
                <h3 className="font-display font-semibold text-foreground text-sm">{chart.title}</h3>
                {chart.data.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie data={chart.data} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value">
                          {chart.data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))", fontSize: "12px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1">
                      {chart.data.map((d) => (
                        <div key={d.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                            <span className="text-muted-foreground">{d.name}</span>
                          </div>
                          <span className="font-semibold text-foreground">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs text-center py-8">No data yet</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Priority progress */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5 card-glow">
          <h3 className="font-display font-semibold text-foreground">Completion by Priority</h3>
          <div className="space-y-4">
            {(["high", "medium", "low"] as const).map((p) => {
              const total = tasks.filter((t) => t.priority === p).length;
              const done = tasks.filter((t) => t.priority === p && t.status === "completed").length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const variants = { high: "success" as const, medium: "warning" as const, low: "info" as const };
              const labels = { high: "🔴 High Priority", medium: "🟡 Medium Priority", low: "🟢 Low Priority" };
              return (
                <div key={p} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">{labels[p]}</span>
                    <span className="text-muted-foreground">{done}/{total} tasks · {pct}%</span>
                  </div>
                  <ProgressBar value={pct} variant={variants[p]} size="md" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
