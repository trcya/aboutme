import Image from "next/image";

// Data Staff agar kode lebih bersih
const staffMembers = [
  { name: "Atomic", img: "/icons/atom.jpg", link: "https://discord.gg/getsades" },
  { name: "Rockhub", img: "/icons/rockhub.jpg", link: "https://discord.gg/8smZnzdy" },
  { name: "P4kongtools", img: "/icons/p4kong.png", link: "https://discord.gg/AcmC2RYN" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Staff */}
        <h4 className="text-xs font-black text-slate-500 border-l-4 border-blue-600 pl-3 uppercase tracking-widest mb-4">
          STAFF
        </h4>
        
        <div className="relative flex overflow-x-hidden bg-white border border-slate-200 rounded-xl shadow-sm group">
          {/* Efek Blur di pinggir agar smooth */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>

          {/* Container Animasi */}
          <div className="flex py-4 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[...staffMembers, ...staffMembers].map((staff, index) => (
              <a 
                key={index} 
                href={staff.link} 
                target="_blank"
                className="mx-4 flex items-center bg-white border border-slate-100 px-4 py-2 rounded-lg font-bold text-slate-700 hover:border-blue-500 transition-colors shadow-sm"
              >
                <div className="relative w-6 h-6 mr-3">
                  <Image 
                    src={staff.img} 
                    alt={staff.name} 
                    fill 
                    className="rounded-md object-cover"
                  />
                </div>
                {staff.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}