function Frame() {
  return <div className="absolute bg-[rgba(255,255,255,0.2)] border-10 border-[#f6bb83] border-solid left-[16px] rounded-[134px] size-[53px] top-0" />;
}

function Frame1() {
  return <div className="absolute border-0 border-[#d2957b] border-solid h-[51px] left-0 rounded-[134px] top-[2px] w-[72.935px]" />;
}

export default function Group() {
  return (
    <div className="relative size-full">
      <Frame />
      <Frame1 />
    </div>
  );
}