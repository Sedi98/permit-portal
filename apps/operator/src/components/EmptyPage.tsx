type EmptyPageProps = {
  title: string;
};

export default function EmptyPage({ title }: EmptyPageProps) {
  return <h1 className="text-2xl font-semibold tracking-tight text-[#1f1f1f]">{title}</h1>;
}
