const PageTitle = ({ title, text }: { title: string; text: string }) => {
  return (
    <div>
      <h2 className="text-stone-900 text-base font-semibold leading-6">
        {title}
      </h2>
      <p className=" text-neutral-500 text-sm font-normal  leading-5">{text}</p>
    </div>
  );
};

export default PageTitle;
