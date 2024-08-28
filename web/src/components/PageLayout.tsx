import { ReactNode } from "react";
import { useTranslations } from "next-intl";

type Props = {
  children?: ReactNode;
};

export default function PageLayout({ children }: Props) {
  const translate = useTranslations("PageLayout");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">{translate("title")}</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
