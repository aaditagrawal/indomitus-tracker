import { styleClass } from "@/styles/classes";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className={styleClass("appPageStyle1")}>
      <main className={styleClass("appPageStyle2")}>
        <h1 className={styleClass("appPageStyle3")}>Welcome to Indomitus</h1>
        <a href="/login">
          <Button>LOG IN</Button>
        </a>
      </main>
    </div>
  );
}
