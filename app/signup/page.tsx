import Main from "@/components/Main";
import Register from "@/components/Register";

export const metadata = {
    title: "ScheduMe | Register",
    description: "Scheduling made painless",
};

export default function page() {

  const isAuth = false

  return (
    <Main>
      <Register/>
    </Main>
  )
}