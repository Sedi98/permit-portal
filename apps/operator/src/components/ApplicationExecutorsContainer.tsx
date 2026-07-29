export interface Executor {
  name: string;
  date: string;
  assignment: string;
}

interface ApplicationExecutorsContainerProps {
  title?: string;
  executors: Executor[];
}

export default function ApplicationExecutorsContainer({
  title = "Müraciətin icraçıları",
  executors,
}: ApplicationExecutorsContainerProps) {
  return (
    <div className="bg-[#FEFEFE] flex flex-col gap-3 p-6">
      <p className="text-[#1F1F1F] font-bold text-xl leading-7">
        {title}
      </p>
      <div className="flex flex-col gap-3 w-full">
        {executors.map((executor, i) => (
          <div
            key={i}
            className={`flex gap-5 items-center px-4 py-2 w-full ${
              i === 0 ? "border-b-[0.8px] border-[#F5F5F5]" : ""
            }`}
          >
            <div className="flex-1 min-w-px">
              <p className="text-[#1F1F1F] text-sm leading-5 truncate">
                {executor.name}
              </p>
            </div>
            <div className="w-[228px] shrink-0">
              <p className="text-[#797979] text-sm leading-5 whitespace-nowrap">
                {executor.date}
              </p>
            </div>
            <div className="flex-1 min-w-px">
              <p className="text-[#1F1F1F] text-sm leading-5 truncate">
                {executor.assignment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
