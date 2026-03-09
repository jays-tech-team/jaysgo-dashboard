interface BlinkCircleProps {
  size?: number;
}
const BlinkCircle: React.FC<BlinkCircleProps> = () => {
  return (
    <span className=" absolute bg-[#155DFC] text-white text-[10px] flex  top-4 left-10 rounded-full w-auto z-10 px-1 ">
      Please Attend
      <span className="absolute inline-flex w-full h-full bg-[#155DFC] rounded-full opacity-75 animate-ping"></span>
    </span>
  );
};

export default BlinkCircle;
