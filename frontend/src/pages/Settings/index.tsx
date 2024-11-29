import { Button } from "@/components/ui/button";

export const Settings = () => {
  return (
    <div className=" py-8 px-6 w-full min-h-screen">
      <div className="w-full flex-col space-y-4 h-full">
        <h2 className="text-3xl font-medium">Settings</h2>
        <div className="flex justify-between bg-slate-100 py-1 px-2 rounded-3xl w-max items-center gap-4 text-xl">
          <div className=" px-8 py-1 bg-black  text-white rounded-3xl">
            Gernal
          </div>
          <div className=" px-8  rounded-3xl">Preference</div>
          <div className=" px-8  rounded-3xl">Banks</div>
        </div>
        <div className="xl:w-2/3 pt-4">
          <div className="flex flex-col gap-6 ">
            <div className="flex space-x-40 border-b pb-4 ">
              <div className="flex flex-col">
                <h5 className="text-lg font-semibold">Your Photo</h5>
                <p>This will be displayed as your profile</p>
              </div>
              <div className="flex items-center  ">
                <div className="w-16 h-16 rounded-full bg-black"></div>
                <Button variant="ghost">Delete</Button>
                <Button variant="ghost">Update</Button>
              </div>
            </div>
            <div className="flex justify-between border-b pb-4 h-full items-center ">
              <div className="flex flex-col">
                <h5 className="text-lg font-semibold">Your Name</h5>
              </div>
              <div className="flex h-full items-center gap-2  ">
                <input
                  placeholder="First Name"
                  className=" py-5 bg-slate-100 w-full h-4 px-4 focus:outline-none focus:border-0 focus:bg-blue-100 shadow-sm rounded-md"
                ></input>
                <input
                  placeholder="Last Name"
                  className="py-2 md:py-5 bg-slate-100 w-full h-1 px-4 focus:outline-none focus:border-0 focus:bg-blue-100 shadow-sm rounded-md"
                ></input>
                <Button className="">Update</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
