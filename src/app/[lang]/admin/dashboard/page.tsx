import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";

export default async function AdminDashboard(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;

  if (!adminSession) {
    redirect(`/${params.lang}/admin`);
  }

  try {
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
    await jwtVerify(adminSession, SECRET);
  } catch (error) {
    redirect(`/${params.lang}/admin`);
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
