import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ApplicationHistoryNote {
  role: string;
  name: string;
  date: string;
  note: string;
}

export interface ApplicationExecutor {
  role: string;
  name: string;
  date: string;
}

interface ApplicationExecutorsContainerProps {
  executors: ApplicationExecutor[];
  notes: ApplicationHistoryNote[];
}

export default function ApplicationExecutorsContainer({
  executors,
  notes,
}: ApplicationExecutorsContainerProps) {
  return (
    <section className="flex flex-col gap-8 bg-[#FEFEFE] p-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold leading-7 text-[#1F1F1F]">
          Müraciətin icraçıları
        </h2>
        <div className="overflow-hidden rounded-lg border border-[#DFDFDF]">
          <Table>
            <TableHeader className="bg-[#F8F8F8]">
              <TableRow>
                <TableHead>Vəzifə</TableHead>
                <TableHead>Ad və soyad</TableHead>
                <TableHead>Təyinat tarixi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executors.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-20 text-center text-[#797979]"
                  >
                    Müraciətə icraçı təyin edilməyib.
                  </TableCell>
                </TableRow>
              ) : (
                executors.map((executor, index) => (
                  <TableRow key={`${executor.name}-${executor.date}-${index}`}>
                    <TableCell className="font-medium text-[#1F1F1F]">
                      {executor.role}
                    </TableCell>
                    <TableCell className="text-[#1F1F1F]">
                      {executor.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-[#797979]">
                      {executor.date}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold leading-7 text-[#1F1F1F]">
          Müraciət üzrə qeydlər
        </h2>
        <div className="overflow-hidden rounded-lg border border-[#DFDFDF]">
          <Table>
            <TableHeader className="bg-[#F8F8F8]">
              <TableRow>
                <TableHead>Vəzifə</TableHead>
                <TableHead>Ad və soyad</TableHead>
                <TableHead>Tarix</TableHead>
                <TableHead>Qeyd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-20 text-center text-[#797979]"
                  >
                    Müraciət üzrə qeyd yoxdur.
                  </TableCell>
                </TableRow>
              ) : (
                notes.map((note, index) => (
                  <TableRow key={`${note.date}-${note.name}-${index}`}>
                    <TableCell className="font-medium text-[#1F1F1F]">
                      {note.role}
                    </TableCell>
                    <TableCell className="text-[#1F1F1F]">
                      {note.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-[#797979]">
                      {note.date}
                    </TableCell>
                    <TableCell className="min-w-72 whitespace-pre-wrap text-[#1F1F1F]">
                      {note.note}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
