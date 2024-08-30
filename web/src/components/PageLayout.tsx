import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  children?: ReactNode;
};

export default function PageLayout({ children }: Props) {
  const translate = useTranslations("PageLayout");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="text-2xl font-bold hover:text-accent-foreground transition-colors"
          >
            {translate("title")}
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
