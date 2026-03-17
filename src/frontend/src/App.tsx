import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Globe,
  Layers,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Route,
  Search,
  Star,
  Train,
  Twitter,
  Users,
  Wrench,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSubmitContactForm } from "./hooks/useQueries";

const queryClient = new QueryClient();

// ─── Data ───────────────────────────────────────────────────────────────────

const heroSlides = [
  {
    image: "/assets/generated/hero-bridge.dim_1600x900.jpg",
    heading:
      "Rail Structure Interaction Studies for the Tallest Railway Bridge in the World",
    subtext: "Chenab Bridge USBRL Project",
    id: "slide-1",
  },
  {
    image: "/assets/generated/hero-metro.dim_1600x900.jpg",
    heading: "World Class Solutions for the Global Railway Market",
    subtext: "Hanoi Pilot Light Rail Project",
    id: "slide-2",
  },
  {
    image: "/assets/generated/hero-tracks.dim_1600x900.jpg",
    heading: "India's First Semi-High Speed Rail Project (180kmph)",
    subtext: "NCRTC RRTS Delhi-Ghaziabad-Meerut",
    id: "slide-3",
  },
];

const services = [
  {
    icon: Search,
    title: "Prebid Engineering and Feasibility Studies",
    desc: "Comprehensive pre-bid analysis and feasibility assessments to ensure project viability and competitive edge.",
    image: "https://primerail.com/wp-content/uploads/2024/11/f1.jpg",
  },
  {
    icon: Layers,
    title: "Detailed Engineering – Civil, Structural, Track, Systems",
    desc: "Full lifecycle detailed engineering across civil, structural, track and systems disciplines.",
    image: "https://primerail.com/wp-content/uploads/2024/11/f3.jpg",
  },
  {
    icon: CheckCircle,
    title: "Proof Checking / Independent Engineer",
    desc: "Third-party verification and independent engineering reviews for safety-critical infrastructure.",
    image: "https://primerail.com/wp-content/uploads/2024/11/f5.jpg",
  },
  {
    icon: Activity,
    title: "Field Investigations",
    desc: "On-site geotechnical, topographic and condition surveys to inform precise engineering decisions.",
    image: "https://primerail.com/wp-content/uploads/2024/11/f11.jpg",
  },
  {
    icon: BarChart3,
    title: "Noise & Vibration Studies",
    desc: "Advanced analysis of noise and vibration impacts for rail corridors in urban environments.",
    image:
      "https://primerail.com/wp-content/uploads/2024/11/railroad-tracks-leading-industrial-area-transportation-theme-1024x512.jpg",
  },
  {
    icon: Wrench,
    title: "Track Technology Innovations",
    desc: "Cutting-edge track technology solutions including slab track, ballastless systems and high-speed applications.",
    image:
      "https://primerail.com/wp-content/uploads/2024/11/closeup-goteik-viaduct-railway-myanmar.jpg",
  },
];

const expertise = [
  {
    icon: Building2,
    title: "Metro",
    desc: "Route planning, feasibility studies, and detailed engineering services in the metro rail domain.",
    image:
      "https://primerail.com/wp-content/uploads/2024/11/trains-railroad-station.jpg",
  },
  {
    icon: Train,
    title: "Railways",
    desc: "Final location survey, detailed project report, site investigations, civil structural track designs, RSI studies.",
    image:
      "https://primerail.com/wp-content/uploads/2024/11/closeup-goteik-viaduct-railway-myanmar.jpg",
  },
  {
    icon: Car,
    title: "Highways",
    desc: "Highway designs, alignment design, traffic studies, structural design, geotechnical studies.",
    image:
      "https://primerail.com/wp-content/uploads/2024/11/organizing-shipment-distribution-logistics.jpg",
  },
  {
    icon: Layers,
    title: "Detailed Engineering",
    desc: "Detailed design consultancy, typography and alignment, structural, civil, track, highway designs.",
    image: "https://primerail.com/wp-content/uploads/2024/11/f3.jpg",
  },
  {
    icon: Globe,
    title: "Pre Bid Services",
    desc: "Pre bid services for metro, railways & highway projects with high success rate.",
    image: "https://primerail.com/wp-content/uploads/2024/11/f1.jpg",
  },
  {
    icon: Route,
    title: "Urban Mobility Services",
    desc: "O&D studies, suburban rail, light rail solutions, last mile connectivity.",
    image:
      "https://primerail.com/wp-content/uploads/2024/11/train-station-leisure-travel-commute.jpg",
  },
];

const leadershipTeam = [
  {
    name: "Suresh Babu Salla (IRSE-99)",
    role: "Managing Director and CEO",
    image: "https://primerail.com/wp-content/uploads/2021/02/suresh.png",
    linkedin: "https://www.linkedin.com/in/suresh-babu-salla-92730323/",
  },
  {
    name: "Sujith Surendran",
    role: "Director (Engineering Services)",
    image: "https://primerail.com/wp-content/uploads/2021/02/sujith.jpg",
    linkedin: "https://www.linkedin.com/in/sujith-surendran-5b4a8310/",
  },
  {
    name: "Sandupatla Mahesh Kumar (IRSE-95)",
    role: "Director (CSS & Track)",
    image: "https://primerail.com/wp-content/uploads/2021/02/mahesh.jpg",
    linkedin:
      "https://www.linkedin.com/in/mahesh-kumar-sandupatla-irse-amie-civil-47b24853/",
  },
  {
    name: "Bhuvaneswara Rao",
    role: "Director (Technical)",
    image:
      "https://primerail.com/wp-content/uploads/2021/02/Bhuvaneswara-Rao-Inapura.jpg",
    linkedin: "https://www.linkedin.com/in/bhuvaneswara-rao-980717119/",
  },
  {
    name: "Busireddy Prashanth Reddy",
    role: "General Manager - Strategic Projects",
    image:
      "https://primerail.com/wp-content/uploads/2025/08/Prashanth-1-e1755689057524.png",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Gajendiran G",
    role: "Construction Support Services",
    image:
      "https://primerail.com/wp-content/uploads/2025/07/Gajendiran-e1753274447747.png",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Priyanka Singh",
    role: "Manager (Operations)",
    image:
      "https://primerail.com/wp-content/uploads/2024/03/priyanka500x500.png",
    linkedin: "https://www.linkedin.com/in/priyanka-singh-109138288/",
  },
  {
    name: "Ankith Kumar C",
    role: "Manager (BD)",
    image:
      "https://primerail.com/wp-content/uploads/2024/03/ankit-500x500-1.png",
    linkedin: "https://www.linkedin.com/in/ankith-vinay-a3b473a0/",
  },
  {
    name: "Nagaraj Ravindra Warad",
    role: "Manager (Finance & Accounts)",
    image: "https://primerail.com/wp-content/uploads/2024/03/nagaraj.jpg",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Shudhir Nath V.G",
    role: "Design Manager (Transportation)",
    image: "https://primerail.com/wp-content/uploads/2025/07/shudhir.png",
    linkedin: "https://www.linkedin.com/in/sudhirnathvg/",
  },
];

const coreTeam = [
  {
    name: "Abhilash Yarragudi Reddy",
    role: "CAD Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/07/Abhilash.png",
    linkedin: "https://www.linkedin.com/in/abhilashyarragudi",
  },
  {
    name: "Abhishek K",
    role: "Sr. Design Engineer (Transportation)",
    image: "https://primerail.com/wp-content/uploads/2025/07/Abhishek.png",
    linkedin: "https://www.linkedin.com/in/abhishekk39",
  },
  {
    name: "Akhil Johnson P J",
    role: "Electronics Engineer (R&D Projects)",
    image: "https://primerail.com/wp-content/uploads/2026/02/Akhil1.png",
    linkedin: "https://www.linkedin.com/in/akhil-johnson-b367551a6",
  },
  {
    name: "Anna Maria Joseph",
    role: "Executive - Contracts & IPR",
    image: "https://primerail.com/wp-content/uploads/2025/11/1000106940.png",
    linkedin: "https://www.linkedin.com/in/anna-maria-joseph-2b7639362/",
  },
  {
    name: "Bhagyamma D N",
    role: "Associate (Admin)",
    image:
      "https://primerail.com/wp-content/uploads/2024/03/bhagya-500x500-1.png",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Charan Chinthalapalli",
    role: "Design Engineer",
    image:
      "https://primerail.com/wp-content/uploads/2024/07/Charan-Chinthalapalli.jpeg",
    linkedin: "https://www.linkedin.com/in/chinthalapalli-charan-1626792a9",
  },
  {
    name: "Chiranth M V",
    role: "CAD Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/07/chiranth-2.png",
    linkedin: "https://www.linkedin.com/in/chiranth-m-v-1b05ab242/",
  },
  {
    name: "Druphad Prajapati",
    role: "Design Coordinator",
    image: "https://primerail.com/wp-content/uploads/2025/07/Dhrupad.png",
    linkedin: "https://www.linkedin.com/in/dhrupad-prajapati-91b65a366/",
  },
  {
    name: "Gajula Harshitha",
    role: "Design Engineer",
    image:
      "https://primerail.com/wp-content/uploads/2024/07/Gajila-Harshitha.jpg",
    linkedin: "https://www.linkedin.com/in/harshitha-gajula-a658171a0/",
  },
  {
    name: "Hariharan",
    role: "Design Engineer-Mechanical (R&D)",
    image: "https://primerail.com/wp-content/uploads/2026/02/hariharan.png",
    linkedin: "https://www.linkedin.com/in/hariharan-n-b22874227/",
  },
  {
    name: "Jai Surya N",
    role: "Structural Engineer (R&D Projects)",
    image: "https://primerail.com/wp-content/uploads/2024/07/Jai-Surya-N.jpg",
    linkedin: "https://www.linkedin.com/in/jai-surya-n-196a53211/",
  },
  {
    name: "K C Krishna Reddy",
    role: "Office Driver",
    image: "https://primerail.com/wp-content/uploads/2025/07/Krishna-Reddy.png",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Madhu Babu Salla",
    role: "Manager (Surveyor)",
    image:
      "https://primerail.com/wp-content/uploads/2025/07/madhu-500x500-1.png",
    linkedin: "https://www.linkedin.com/in/madhu-babu-salla-82748b1a/",
  },
  {
    name: "Nandadeep",
    role: "AI/ML Intern",
    image: "https://primerail.com/wp-content/uploads/2026/03/Nandadeep.png",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Nidhi Prabhu K T",
    role: "Structural Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/07/Nidhi.png",
    linkedin: "https://www.linkedin.com/in/nidhi-prabhu-k-t-b53044266/",
  },
  {
    name: "Ninitha Gokak",
    role: "Sr. CAD Engineer",
    image:
      "https://primerail.com/wp-content/uploads/2024/03/Ninitha500x500.png",
    linkedin: "https://www.linkedin.com/in/ninitha-gokak-6a1171251/",
  },
  {
    name: "Prajwal L",
    role: "Sr. Design Engineer (Transportation)",
    image: "https://primerail.com/wp-content/uploads/2024/07/Prajwal-L.jpg",
    linkedin: "https://www.linkedin.com/in/prajwal-l-804a20190",
  },
  {
    name: "Rajesh S",
    role: "CAD Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/07/Rajeshs.png",
    linkedin: "https://www.linkedin.com/in/rajesh-s-b07478298/",
  },
  {
    name: "Rangaswamy G",
    role: "CAD Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/08/Rajesh.png",
    linkedin: "https://www.linkedin.com/in/rangaswamy-g-941347347/",
  },
  {
    name: "Ranjith R",
    role: "IT (Executive)",
    image: "https://primerail.com/wp-content/uploads/2025/08/Ranjith.jpg",
    linkedin: "https://www.linkedin.com/in/ranjith8/",
  },
  {
    name: "Saddam Khan",
    role: "Surveyor (CSS & Track)",
    image: "https://primerail.com/wp-content/uploads/2025/07/saddam-1.png",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Sarath Krishnan P",
    role: "Production Engineer (R&D Projects)",
    image: "https://primerail.com/wp-content/uploads/2025/07/Sarath.webp",
    linkedin: "https://www.linkedin.com/in/sarath-krishnan-p-4bb03a21b/",
  },
  {
    name: "Sharanya V",
    role: "Human Resources",
    image:
      "https://primerail.com/wp-content/uploads/2025/07/Sharanya-scaled-e1753275640957.webp",
    linkedin: "https://www.linkedin.com/in/sharanya-v-b77236277/",
  },
  {
    name: "Shashank",
    role: "CAD Engineer",
    image:
      "https://primerail.com/wp-content/uploads/2025/07/shashank-e1753705257474.png",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Shilpa I Sobarad",
    role: "CAD Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/07/Shilpai.png",
    linkedin: "https://www.linkedin.com/in/shilpa-sobarad-4973681bb/",
  },
  {
    name: "Sinchana H P",
    role: "CAD Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/07/Sinchana.jpeg",
    linkedin: "https://www.linkedin.com/in/sinchana-hp-sss/",
  },
  {
    name: "Suhera Fathima U",
    role: "Design Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/07/Suhera.png",
    linkedin: "https://www.linkedin.com/in/suhera-fathima-u-a15827271/",
  },
  {
    name: "Suman S",
    role: "CAD Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/07/Suman.png",
    linkedin: "https://www.linkedin.com/in/suman-gowda-242073219/",
  },
  {
    name: "Supriya",
    role: "Sr. CAD Engineer",
    image: "https://primerail.com/wp-content/uploads/2025/07/Supriya.webp",
    linkedin: "https://www.linkedin.com/",
  },
];

const testimonials = [
  {
    quote:
      "The quality of submission were up to the mark. Submittals were received in time. Very good working experience with Primerail Infralabs.",
    author: "P.K Ray",
    company: "ITD CEMENTATION INDIA",
  },
  {
    quote:
      "Prompt, excellent services provided with strong technical support as requested.",
    author: "Moses Sukumar",
    company: "APURUVAKIRTI INFRASTRUCTURE PVT LTD",
  },
  {
    quote:
      "The work quality and time management is excellent. We appreciate for the continuous support from prime rail even after the working hours.",
    author: "Rajesh Duggirala",
    company: "Patil Rail Infrastructure Pvt. Ltd",
  },
  {
    quote: "The quality of the services is very good and on time.",
    author: "Swaswata Das Mallick",
    company: "Rahee Infra Tech Limited",
  },
  {
    quote:
      "Prime rail are timely acting as per client requirement and sharing knowledge of load distribution calculation.",
    author: "B. Sai Raj",
    company: "RVNL",
  },
];

const stats = [
  { value: 150, suffix: "+", label: "Projects Successfully" },
  { value: 50, suffix: "+", label: "Primerailians" },
  { value: 100, suffix: "%", label: "Commitment to Quality" },
  { value: 98, suffix: "%", label: "Satisfied Customers" },
];

const navLinks = [
  { label: "Home", href: "#home" },
  {
    label: "About Us",
    href: "#about",
    children: [
      { label: "Who We Are", href: "#about" },
      { label: "Our Team", href: "#team" },
      { label: "Awards", href: "#about" },
    ],
  },
  {
    label: "Services",
    href: "#services",
    children: [
      { label: "Track", href: "#services" },
      { label: "Final Location Survey", href: "#services" },
    ],
  },
  {
    label: "Rail Products",
    href: "#services",
    children: [
      { label: "Fastening Systems", href: "#services" },
      { label: "Track Structure", href: "#services" },
      { label: "Elastomer Pads", href: "#services" },
    ],
  },
  { label: "Career", href: "#contact" },
  { label: "Blog", href: "#contact" },
  { label: "Contact Us", href: "#contact" },
];

// ─── Counter Hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  value,
  suffix,
  label,
  start,
}: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCountUp(value, 1800, start);
  return (
    <div className="text-center">
      <div className="text-5xl font-display font-bold text-black mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-gray-800 text-sm uppercase tracking-widest font-medium">
        {label}
      </div>
    </div>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="bg-[#0a2240] text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-6">
          <a
            href="tel:08048665725"
            className="flex items-center gap-1.5 hover:text-orange transition-colors text-sm font-medium"
            data-ocid="topbar.phone.link"
          >
            <Phone size={16} />
            <span>080 4866 5725</span>
          </a>
          <a
            href="mailto:emailus@primerail.com"
            className="flex items-center gap-1.5 hover:text-orange transition-colors text-sm font-medium"
            data-ocid="topbar.email.link"
          >
            <Mail size={16} />
            <span>emailus@primerail.com</span>
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="http://www.facebook.com/primerail/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange transition-colors"
            data-ocid="topbar.facebook.link"
          >
            <Facebook size={16} />
          </a>
          <a
            href="https://x.com/primerail"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange transition-colors"
            data-ocid="topbar.twitter.link"
          >
            <Twitter size={16} />
          </a>
          <a
            href="https://www.linkedin.com/company/25056485/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange transition-colors"
            data-ocid="topbar.linkedin.link"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="https://www.youtube.com/@primerailinfralabs9464/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange transition-colors"
            data-ocid="topbar.youtube.link"
          >
            <Youtube size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 group"
          data-ocid="nav.logo.link"
        >
          <img
            src="/assets/uploads/image-1.png"
            alt="Primerail Infralabs Logo"
            className="h-12 w-auto object-contain"
          />
          <span className="font-display font-bold text-navy text-lg leading-tight">
            Primerail
            <br />
            <span className="text-xs font-medium text-navy/60 tracking-wider uppercase">
              Infralabs
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {link.children ? (
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-navy/80 hover:text-orange transition-colors rounded-md hover:bg-orange/5"
                  data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "-")}.link`}
                >
                  {link.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <a
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-navy/80 hover:text-orange transition-colors rounded-md hover:bg-orange/5"
                  data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "-")}.link`}
                >
                  {link.label}
                </a>
              )}
              {link.children && openDropdown === link.label && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg py-2 min-w-[180px] border border-border z-50">
                  {link.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-navy/70 hover:text-orange hover:bg-orange/5 transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden p-2 text-navy rounded-md hover:bg-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.menu.toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-t border-border"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2.5 text-sm font-medium text-navy hover:text-orange transition-colors rounded-md hover:bg-orange/5"
                  onClick={() => setMobileOpen(false)}
                  data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/ /g, "-")}.link`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero Slider ─────────────────────────────────────────────────────────────

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [isTransitioning],
  );

  const prev = () =>
    goTo((current - 1 + heroSlides.length) % heroSlides.length);
  const next = useCallback(
    () => goTo((current + 1) % heroSlides.length),
    [current, goTo],
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      id="home"
      className="relative h-[90vh] min-h-[560px] overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Slides */}
      {heroSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-800 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDuration: "800ms" }}
        >
          <img
            src={slide.image}
            alt={slide.heading}
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <p className="text-orange font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                {heroSlides[current].subtext}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] mb-6">
                {heroSlides[current].heading}
              </h1>
              <a href="#about" data-ocid="hero.learn-more.button">
                <Button className="bg-orange hover:bg-orange-hover text-white font-semibold px-8 py-3 h-auto text-base rounded-md">
                  Learn More <ArrowRight size={16} className="ml-2" />
                </Button>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
        data-ocid="hero.prev.button"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
        data-ocid="hero.next.button"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((slide, i) => (
          <button
            type="button"
            key={slide.id}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-2.5 bg-orange"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
            data-ocid={`hero.dot.${i + 1}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── About Section ───────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-20 bg-cyan-50" data-ocid="about.section">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img
            src="/assets/generated/about-team.dim_800x600.jpg"
            alt="Primerail team"
            className="w-full rounded-xl shadow-card object-cover h-[420px]"
          />
          <div className="absolute -bottom-5 -right-5 bg-orange text-white rounded-xl px-6 py-4 shadow-lg">
            <div className="text-3xl font-display font-bold">8+</div>
            <div className="text-sm font-medium opacity-90">
              Years Experience
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-orange text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Welcome to Primerail Infralabs
          </p>
          <h2 className="text-4xl font-display font-bold text-black mb-6 leading-tight">
            Maximising Sustainable Transit
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Primerail Infralabs with its diverse experience working in domestic
            and International projects is uniquely positioned in the Railway
            Industry to provide the most advanced and value added engineering
            solutions catering to entire life cycle of Railway projects of
            different magnitudes.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            Maximising sustainable transit has been imbibed as the guiding
            principle in all our offerings to the client.
          </p>
          <a href="#team" data-ocid="about.learn-more.button">
            <Button className="bg-navy hover:bg-navy-dark text-white px-8 py-3 h-auto font-semibold rounded-md">
              About Us <ArrowRight size={16} className="ml-2" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Services Section ────────────────────────────────────────────────────────

function ServicesSection() {
  return (
    <section
      id="services"
      className="py-20 bg-amber-50"
      data-ocid="services.section"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-orange text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            What We Do
          </p>
          <h2 className="text-4xl font-display font-bold text-black">
            Engineering Services
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="service-card bg-white rounded-xl shadow-card transition-all duration-300 group cursor-pointer overflow-hidden"
              data-ocid={`services.item.${i + 1}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/10 transition-colors duration-300" />
              </div>
              <div className="p-7">
                <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-orange transition-colors">
                  <svc.icon
                    size={22}
                    className="text-orange group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-display font-semibold text-black text-lg mb-3 leading-snug">
                  {svc.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {svc.desc}
                </p>
                <span className="text-orange text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Expertise Section ───────────────────────────────────────────────────────

function ExpertiseSection() {
  return (
    <section className="py-20 bg-violet-100" data-ocid="expertise.section">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-orange text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            What We Specialise In
          </p>
          <h2 className="text-4xl font-display font-bold text-black">
            Our Expertise
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {expertise.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="expertise-card bg-white rounded-lg shadow-md border border-violet-200 transition-all duration-300 hover:bg-violet-50 group overflow-hidden"
              data-ocid={`expertise.item.${i + 1}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-violet-900/20 group-hover:bg-violet-900/10 transition-colors duration-300" />
              </div>
              <div className="p-6">
                <div className="w-10 h-10 bg-orange/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange transition-colors">
                  <item.icon
                    size={18}
                    className="text-orange group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-display font-semibold text-black text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Team Section ────────────────────────────────────────────────────────────

function MemberCard({
  member,
  index,
  offset = 0,
}: {
  member: { name: string; role: string; image: string; linkedin: string };
  index: number;
  offset?: number;
}) {
  return (
    <motion.div
      key={member.name}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-center group overflow-hidden"
      data-ocid={`team.item.${offset + index + 1}`}
    >
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const t = e.currentTarget;
            t.style.display = "none";
            const parent = t.parentElement;
            if (parent) {
              parent.className =
                "w-full aspect-square bg-navy flex items-center justify-center";
              const initials = document.createElement("span");
              initials.className = "text-white font-bold text-2xl";
              initials.textContent = member.name
                .split(" ")
                .map((w: string) => w[0])
                .slice(0, 2)
                .join("");
              parent.appendChild(initials);
            }
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-black text-sm mb-1 leading-snug">
          {member.name}
        </h3>
        <p className="text-gray-600 text-xs mb-3 leading-snug">{member.role}</p>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-7 h-7 bg-navy/10 hover:bg-orange rounded-md transition-colors"
          data-ocid={`team.linkedin.${offset + index + 1}`}
          aria-label={`${member.name} LinkedIn`}
        >
          <Linkedin size={13} className="text-navy group-hover:text-white" />
        </a>
      </div>
    </motion.div>
  );
}

function TeamSection() {
  return (
    <section id="team" className="py-20 bg-emerald-50" data-ocid="team.section">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-orange text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            People
          </p>
          <h2 className="text-4xl font-display font-bold text-black">
            Our Team
          </h2>
        </motion.div>

        {/* Leadership Team */}
        <div className="mb-14">
          <h3 className="text-2xl font-display font-bold text-black mb-8 text-center">
            Leadership Team
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {leadershipTeam.map((member, i) => (
              <MemberCard
                key={member.name}
                member={member}
                index={i}
                offset={0}
              />
            ))}
          </div>
        </div>

        {/* Core Team */}
        <div>
          <h3 className="text-2xl font-display font-bold text-black mb-8 text-center">
            Core Team
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {coreTeam.map((member, i) => (
              <MemberCard
                key={member.name}
                member={member}
                index={i}
                offset={leadershipTeam.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ────────────────────────────────────────────────────

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-yellow-50" data-ocid="testimonials.section">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-orange text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Client Feedback
          </p>
          <h2 className="text-4xl font-display font-bold text-black">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-card p-10 text-center"
              data-ocid="testimonials.card"
            >
              <div className="text-orange text-6xl font-display leading-none mb-4 select-none">
                "
              </div>
              <p className="text-gray-800 text-lg leading-relaxed italic mb-8">
                {testimonials[current].quote}
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
                  <Star size={16} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-display font-semibold text-black">
                    {testimonials[current].author}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonials[current].company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((t, i) => (
              <button
                type="button"
                key={t.author}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2 bg-orange"
                    : "w-2 h-2 bg-gray-400 hover:bg-gray-600"
                }`}
                data-ocid={`testimonials.dot.${i + 1}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Section ───────────────────────────────────────────────────────────

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  return (
    <section ref={ref} className="py-20 bg-teal-500" data-ocid="stats.section">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-display font-bold text-black mb-12">
          Insights
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} start={started} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ─────────────────────────────────────────────────────────

function ContactSection() {
  const { mutateAsync, isPending } = useSubmitContactForm();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync(form);
      toast.success("Message sent successfully! We'll be in touch soon.");
      setSuccess(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section
      id="contact"
      className="py-20 bg-sky-50"
      data-ocid="contact.section"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-orange text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Reach Out
          </p>
          <h2 className="text-4xl font-display font-bold text-black">
            Get In Touch
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 h-full text-black">
              <h3 className="font-display font-semibold text-xl mb-8 text-black">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-orange/30">
                    <MapPin size={18} className="text-orange" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-black">Address</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Unit A, Brigade Signature Towers, #806, 8th Floor,
                      <br />
                      Old Madras Rd, Bengaluru, Karnataka 560049
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-orange" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-black">Phone</p>
                    <a
                      href="tel:08048665725"
                      className="text-gray-700 text-sm hover:text-orange transition-colors"
                    >
                      080 4866 5725
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-orange" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-black">Email</p>
                    <a
                      href="mailto:emailus@primerail.com"
                      className="text-gray-700 text-sm hover:text-orange transition-colors"
                    >
                      emailus@primerail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {success ? (
              <div
                className="flex flex-col items-center justify-center h-full text-center p-8"
                data-ocid="contact.success_state"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="font-display font-bold text-2xl text-black mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 mb-6">
                  We'll get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSuccess(false)}
                  className="border-navy text-navy hover:bg-navy hover:text-white"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    className="block text-sm font-medium text-black mb-1.5"
                    htmlFor="contact-name"
                  >
                    Full Name <span className="text-orange">*</span>
                  </label>
                  <Input
                    id="contact-name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your full name"
                    required
                    className="h-11"
                    data-ocid="contact.name.input"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-black mb-1.5"
                    htmlFor="contact-phone"
                  >
                    Phone Number <span className="text-orange">*</span>
                  </label>
                  <Input
                    id="contact-phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+91 00000 00000"
                    required
                    className="h-11"
                    data-ocid="contact.phone.input"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-black mb-1.5"
                    htmlFor="contact-email"
                  >
                    Email Address <span className="text-orange">*</span>
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@company.com"
                    required
                    className="h-11"
                    data-ocid="contact.email.input"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-black mb-1.5"
                    htmlFor="contact-message"
                  >
                    Message
                  </label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Tell us about your project..."
                    rows={4}
                    data-ocid="contact.message.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-orange hover:bg-orange-hover text-white font-semibold h-12 text-base rounded-md"
                  data-ocid="contact.submit.button"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-orange rounded-md flex items-center justify-center">
                <Train size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                Primerail Infralabs
              </span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Maximising sustainable transit has been imbibed as the guiding
              principle in all our offerings.
            </p>
            <div className="flex gap-3">
              <a
                href="http://www.facebook.com/primerail/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 hover:bg-orange rounded-md flex items-center justify-center transition-colors"
                data-ocid="footer.facebook.link"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://x.com/primerail"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 hover:bg-orange rounded-md flex items-center justify-center transition-colors"
                data-ocid="footer.twitter.link"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://www.linkedin.com/company/25056485/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 hover:bg-orange rounded-md flex items-center justify-center transition-colors"
                data-ocid="footer.linkedin.link"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.youtube.com/@primerailinfralabs9464/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 hover:bg-orange rounded-md flex items-center justify-center transition-colors"
                data-ocid="footer.youtube.link"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-5 text-white/90">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {["About Us", "Blog", "Contact Us"].map((item) => (
                <li key={item}>
                  <a
                    href="#about"
                    className="text-white/55 text-sm hover:text-orange transition-colors flex items-center gap-1.5"
                    data-ocid={`footer.${item.toLowerCase().replace(/ /g, "-")}.link`}
                  >
                    <ArrowRight size={12} />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Rail Products */}
          <div>
            <h4 className="font-display font-semibold mb-5 text-white/90">
              Rail Products
            </h4>
            <ul className="space-y-2.5">
              {["Fastening Systems", "Track Structure", "Elastomer Pads"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#services"
                      className="text-white/55 text-sm hover:text-orange transition-colors flex items-center gap-1.5"
                      data-ocid={`footer.${item.toLowerCase().replace(/ /g, "-")}.link`}
                    >
                      <ArrowRight size={12} />
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold mb-5 text-white/90">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex gap-2 text-white/55 text-sm">
                <MapPin
                  size={14}
                  className="text-orange flex-shrink-0 mt-0.5"
                />
                <span>
                  Unit A, Brigade Signature Towers, #806, 8th Floor, Old Madras
                  Rd, Bengaluru 560049
                </span>
              </div>
              <div className="flex gap-2 text-white/55 text-sm">
                <Phone size={14} className="text-orange flex-shrink-0" />
                <a
                  href="tel:08048665725"
                  className="hover:text-orange transition-colors"
                >
                  080 4866 5725
                </a>
              </div>
              <div className="flex gap-2 text-white/55 text-sm">
                <Mail size={14} className="text-orange flex-shrink-0" />
                <a
                  href="mailto:emailus@primerail.com"
                  className="hover:text-orange transition-colors"
                >
                  emailus@primerail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>Primerail Infralabs © 2017-{year}. All rights reserved</p>
          <p>
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

function PrimerailSite() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <TopBar />
      <Navbar />
      <main>
        <HeroSlider />
        <AboutSection />
        <ServicesSection />
        <ExpertiseSection />
        <TeamSection />
        <TestimonialsSection />
        <StatsSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PrimerailSite />
    </QueryClientProvider>
  );
}
