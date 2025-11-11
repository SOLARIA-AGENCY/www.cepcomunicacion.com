import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { DashboardPage } from "./pages/DashboardPage"
import { CoursesPage } from "./pages/CoursesPage"
import { ProgrammingPage } from "./pages/ProgrammingPage"
import { PlannerPage } from "./pages/PlannerPage"
import { TeachersPage } from "./pages/TeachersPage"
import { StudentsPage } from "./pages/StudentsPage"
import { AdministrativePage } from "./pages/AdministrativePage"
import { CampusPage } from "./pages/CampusPage"
import { CyclesPage } from "./pages/CyclesPage"
import { ClassroomsPage } from "./pages/ClassroomsPage"
import { ClassroomsNortePage } from "./pages/ClassroomsNortePage"
import { ClassroomsSantaCruzPage } from "./pages/ClassroomsSantaCruzPage"
import { ClassroomsSurPage } from "./pages/ClassroomsSurPage"
import { LeadsPage } from "./pages/LeadsPage"
import { AnalyticsPage } from "./pages/AnalyticsPage"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cep-admin-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="cursos" element={<CoursesPage />} />
            <Route path="cursos/programacion" element={<ProgrammingPage />} />
            <Route path="cursos/planner" element={<PlannerPage />} />
            <Route path="profesores" element={<TeachersPage />} />
            <Route path="alumnos" element={<StudentsPage />} />
            <Route path="personal" element={<AdministrativePage />} />
            <Route path="sedes" element={<CampusPage />} />
            <Route path="ciclos" element={<CyclesPage />} />
            <Route path="aulas" element={<ClassroomsPage />} />
            <Route path="aulas/cep-norte" element={<ClassroomsNortePage />} />
            <Route path="aulas/cep-santa-cruz" element={<ClassroomsSantaCruzPage />} />
            <Route path="aulas/cep-sur" element={<ClassroomsSurPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="analiticas" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
