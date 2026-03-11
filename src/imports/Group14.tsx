import imgImage27 from "@/assets/4dfdf090034a8269af6af2072b87c0b0d6e5e4db.png";
import imgImage26 from "@/assets/e7eec2cbcb11f3e8d9888a6990dbe01c94dac676.png";
import imgImage29 from "@/assets/3b79e8729be1ca262d707cf0b680da3d11401780.png";

function Frame() {
  return (
    <div className="absolute bg-white border-13 border-[#f6bb83] border-solid left-0 overflow-clip rounded-[183px] size-[297px] top-0">
      <div className="absolute h-[178px] left-[-81px] top-[-62px] w-[314px]" data-name="image 28" />
      <div className="absolute h-[165.975px] left-[-32px] top-[-62px] w-[258px]" data-name="image 27">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage27} />
      </div>
      <div className="absolute h-[117px] left-[-23px] top-[-13px] w-[199px]" data-name="image 26">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage26} />
      </div>
      <div className="absolute h-[546px] left-[-224px] top-[-187px] w-[943px]" data-name="image 29">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage29} />
      </div>
    </div>
  );
}

function Frame1() {
  return <div className="absolute border-4 border-[#d2957b] border-solid left-0 rounded-[213px] size-[297px] top-0" />;
}

export default function Group() {
  return (
    <div className="relative shadow-[0px_4px_15.2px_0px_rgba(0,0,0,0.25)] size-full">
      <Frame />
      <Frame1 />
    </div>
  );
}