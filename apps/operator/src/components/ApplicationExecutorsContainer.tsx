export interface Executor {
  name: string;
  date: string;
  assignment: string;
}

interface ApplicationExecutorsContainerProps {
  title?: string;
  executors: Executor[];
  note?: string | null;
}

export default function ApplicationExecutorsContainer({
  title = "Müraciətin icraçıları",
  executors,
  note,
}: ApplicationExecutorsContainerProps) {
  return (
    <div className="bg-[#FEFEFE] flex flex-col gap-3 p-6">
      <p className="text-[#1F1F1F] font-bold text-xl leading-7">
        {title}
      </p>
      <div className="flex flex-col gap-3 w-full">
        {executors.length === 0 ? (
          <p className="px-4 py-3 text-sm text-[#797979]">
            Müraciətə icraçı təyin edilməyib.
          </p>
        ) : executors.map((executor, i) => (
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
      {note ? (
        <div className="border-t border-[#F5F5F5] px-4 pt-4 grid grid-cols-2">
          <p className="text-sm font-medium leading-5 text-[#797979]">Qeyd</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-[#1F1F1F]">
            {note}
          </p>
        </div>
      ) : null}
    </div>
  );
}
