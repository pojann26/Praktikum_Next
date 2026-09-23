import { checkDbConnection, getStudents } from "./actions";
import StudentDashboard from "./components/StudentDashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [dbStatus, studentsRes] = await Promise.all([
    checkDbConnection(),
    getStudents(),
  ]);

  return (
    <StudentDashboard
      initialStudents={studentsRes.data || []}
      initialDbStatus={dbStatus}
    />
  );
}
