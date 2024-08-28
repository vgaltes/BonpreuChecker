import { ReactNode } from "react";
import { useTranslations } from "next-intl";

type Props = {
  children?: ReactNode;
};

export default function PageLayout({ children }: Props) {
  const translate = useTranslations("PageLayout");

  return (
    <>
      <div
        style={{
          padding: 24,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.5,
        }}
      >
        <div style={{ maxWidth: 510 }}>
          <h1>{translate("title")}</h1>
          {children}
        </div>
      </div>
    </>
  );
}
