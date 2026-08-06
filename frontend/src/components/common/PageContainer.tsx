// src/components/common/PageContainer.tsx

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        minHeight: "70vh",
      }}
    >
      {children}
    </div>
  );
}