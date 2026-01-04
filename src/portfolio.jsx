
import React, { useState, useRef, useEffect } from 'react';

import { motion, useScroll, useSpring, useInView, AnimatePresence } from 'framer-motion';

import { 

  Code2, 

  Github, 

  Linkedin, 

  Mail,

  ChevronRight,

  Monitor,

  Database,

  ShieldCheck,

  Smartphone,

  MapPin,

  Activity,

  Globe,

  Terminal,

  Cpu,

  Sparkles,

  Layers,

  ArrowUpRight,

  Hexagon,

  Menu,

  X,

  Box,

  Layout,
  Download

} from 'lucide-react';



const Spotlight = () => {

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {

    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);

  }, []);



  return (

    <motion.div 

      className="pointer-events-none fixed inset-0 z-30"

      animate={{

        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.12), transparent 80%)`

      }}

    />

  );

};



const ProjectCard = ({ proj }) => {

  const x = useSpring(0, { stiffness: 100, damping: 30 });

  const y = useSpring(0, { stiffness: 100, damping: 30 });



  const handleMouseMove = (e) => {

    const rect = e.currentTarget.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;

    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / rect.width - 0.5) * 20;

    const yPct = (mouseY / rect.height - 0.5) * -20;

    x.set(xPct);

    y.set(yPct);

  };



  const handleMouseLeave = () => {

    x.set(0);

    y.set(0);

  };



  return (

    <motion.div 

      onMouseMove={handleMouseMove}

      onMouseLeave={handleMouseLeave}

      style={{ rotateX: y, rotateY: x, transformStyle: "preserve-3d" }}

      className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 flex flex-col h-full relative overflow-hidden rounded-sm"

    >

      <div className="aspect-video relative overflow-hidden">

        <motion.img 

          src={proj.img} 

          alt={proj.title} 

          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-100 group-hover:scale-105" 

        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />

        <div className="absolute top-4 right-4 bg-cyan-500 text-black text-[8px] font-black px-2 py-1 uppercase tracking-tighter">

          ACTIVE_DEPLOYMENT

        </div>

      </div>

      

      <div className="p-8 flex flex-col flex-grow relative" style={{ transform: "translateZ(30px)" }}>

        <div className="flex items-center gap-2 mb-3">

          <Terminal size={12} className="text-cyan-500" />

          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{proj.tag}</span>

        </div>

        <h4 className="text-2xl font-black uppercase text-white mb-4 group-hover:text-cyan-400 transition-colors leading-none tracking-tighter">

          {proj.title}

        </h4>

        <p className="text-zinc-500 text-xs leading-relaxed mb-8 flex-grow font-medium">

          {proj.desc}

        </p>

        <div className="pt-6 border-t border-zinc-800/50 flex justify-between items-center">

          <a href={proj.link} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:text-cyan-400 transition-colors">

            ACCESS_SYSTEM <ArrowUpRight size={14} />

          </a>

          <Github size={18} className="text-zinc-700 hover:text-white cursor-pointer transition-colors" />

        </div>

      </div>

    </motion.div>

  );

};



const ActionButton = ({ children, primary, onClick, href }) => {

  const content = (

    <button 

      onClick={onClick}

      className={`group relative px-10 py-5 font-bold uppercase tracking-[0.3em] text-[10px] transition-all duration-500 overflow-hidden w-full md:w-auto border

        ${primary ? 'bg-white text-black border-white' : 'border-zinc-800 text-white hover:border-cyan-500'}

      `}

    >

      <span className="relative z-10 flex items-center justify-center gap-3">{children}</span>

      <motion.div 

        className={`absolute inset-0 ${primary ? 'bg-cyan-500' : 'bg-cyan-500/10'}`}

        initial={{ y: "100%" }}

        whileHover={{ y: 0 }}

        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}

      />

    </button>

  );



  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="block">{content}</a> : content;

};



const Section = ({ children, id, className = "" }) => {

  const ref = useRef(null);

  const isInView = useInView(ref, { margin: "-20% 0px", once: true });



  return (

    <section ref={ref} id={id} className={`min-h-screen relative flex items-center justify-center py-32 px-6 md:px-24 ${className}`}>

      <motion.div

        initial={{ opacity: 0, y: 50 }}

        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}

        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}

        className="w-full max-w-7xl relative z-20"

      >

        {children}

      </motion.div>

    </section>

  );

};



export default  function Portfolio() {

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [headerScrolled, setHeaderScrolled] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);



  useEffect(() => {

    const handleScroll = () => setHeaderScrolled(window.scrollY > 50);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  const projects = [

    {

      id: 'SYS-01',

      title: "Genius AI SaaS",

      tag: "Next.js / Prisma / Stripe",

      desc: "Architected a comprehensive AI ecosystem enabling multimodal content generation. Leveraged OpenAI & Replicate APIs with complex state synchronization.",

      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",

      link: "#"

    },

    {

      id: 'SYS-02',

      title: "Spotify Core Engine",

      tag: "HTML / CSS / JavaScript",

      desc: "Engineered a high-performance audio engine with vanilla JS. Features custom data structures for playlist management and real-time DOM updates.",

      img: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=800",

      link: "#"

    },

    {

      id: 'SYS-03',

      title: "Task Matrix",

      tag: "JavaScript / DOM",

      desc: "Focused on high-efficiency state persistence and reactive UI patterns. Implemented advanced drag-and-drop mechanics and local synchronization.",

      img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800",

      link: "#"

    }

  ];



  const skills = [

    { name: "Java (OOPs)", level: "Advanced", icon: <Cpu size={14}/> },

    { name: "React.js", level: "Intermediate", icon: <Sparkles size={14}/> },

    { name: "Next.js", level: "Intermediate", icon: <Layers size={14}/> },

    { name: "MySQL", level: "Fundamental", icon: <Database size={14}/> },

    { name: "Tailwind CSS", level: "Advanced", icon: <Monitor size={14}/> },

    { name: "Git / GitHub", level: "Advanced", icon: <Github size={14}/> }

  ];



  const navLinks = [

    { label: 'Stack', href: '#section-1', icon: <Box size={14} /> },

    { label: 'Work', href: '#section-2', icon: <Layout size={14} /> },

    { label: 'Contact', href: '#section-3', icon: <Mail size={14} /> }

  ];



  const scrollTo = (href) => {

    setIsMenuOpen(false);

    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  };



  return (

    <div className="bg-[#050505] text-zinc-300 font-sans selection:bg-cyan-500 selection:text-black antialiased overflow-x-hidden">

      <Spotlight />

      

      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-600 to-cyan-400 origin-left z-[110]" style={{ scaleX }} />



      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.05]" 

           style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />



      {/* HEADER */}

      <header 

        className={`fixed top-0 left-0 right-0 z-[100] px-8 py-6 md:px-16 flex justify-between items-center transition-all duration-500 

          ${headerScrolled ? 'bg-black/30 backdrop-blur-md border-b border-zinc-800/50' : 'bg-transparent'}`}

      >

        <motion.div 

          initial={{ opacity: 0, x: -20 }}

          animate={{ opacity: 1, x: 0 }}

          className="flex items-center gap-6 group cursor-pointer"

          onClick={() => window.scrollTo({top:0, behavior:'smooth'})}

        >

          <div className="relative">

            <div className="w-10 h-10 border border-zinc-800 group-hover:border-cyan-500 transition-all duration-500 rotate-45" />

            <div className="absolute inset-0 flex items-center justify-center">

              <div className="w-2 h-2 bg-white group-hover:bg-cyan-500 transition-colors" />

            </div>

          </div>

          <div className="flex flex-col">

            <span className="text-sm font-black tracking-[0.4em] uppercase text-white leading-none">SHIVANI</span>

            <span className="text-[9px] font-bold tracking-[0.2em] text-cyan-600 uppercase mt-2">B.TECH GRADUATE '24</span>

          </div>

        </motion.div>



        <nav className="hidden lg:flex gap-12 text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">

          {navLinks.map((item) => (

            <motion.a 

              key={item.label} 

              href={item.href} 

              onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}

              whileHover={{ scale: 1.1, color: '#fff' }}

              className="relative group py-2"

            >

              {item.label}

              <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-500 group-hover:w-full transition-all duration-300" />

            </motion.a>

          ))}

        </nav>



        <div className="flex items-center gap-8">

          <motion.a whileHover={{ y: -2 }} href="#" className="hidden md:block hover:text-cyan-500 transition-colors"><Github size={20}/></motion.a>

          <motion.a whileHover={{ y: -2 }} href="#" className="hidden md:block hover:text-cyan-500 transition-colors"><Linkedin size={20}/></motion.a>
 <ActionButton 
                                href="#" 
                                download="Shivani_CV.pdf"
                                className="hidden sm:block"
                            >
                               <Download/> CV
                            </ActionButton>
          <button 

            onClick={() => setIsMenuOpen(!isMenuOpen)}

            className="w-10 h-10 flex items-center justify-center border border-zinc-800 hover:border-cyan-500 transition-colors bg-black/50"

          >

            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}

          </button>

        </div>

      </header>



      {/* FULL SCREEN MENU */}

      <AnimatePresence>

        {isMenuOpen && (

          <motion.div 

            initial={{ opacity: 0, y: -20 }}

            animate={{ opacity: 1, y: 0 }}

            exit={{ opacity: 0, y: -20 }}

            className="fixed inset-0 z-[95] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8"

          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl w-full">

              <div className="space-y-8">

                <span className="text-[10px] font-black text-cyan-500 tracking-[0.4em] uppercase">Navigation_Index</span>

                <nav className="flex flex-col gap-6">

                  {navLinks.map((link, i) => (

                    <motion.button

                      key={link.label}

                      initial={{ opacity: 0, x: -20 }}

                      animate={{ opacity: 1, x: 0 }}

                      transition={{ delay: i * 0.1 }}

                      onClick={() => scrollTo(link.href)}

                      className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-left text-zinc-800 hover:text-white hover:pl-6 transition-all duration-500 group"

                    >

                      <span className="text-cyan-500 text-lg mr-4 font-mono group-hover:mr-8 transition-all">0{i+1}.</span>

                      {link.label}

                    </motion.button>

                  ))}

                </nav>

              </div>

              <div className="hidden md:flex flex-col justify-end space-y-12">

                <div className="border-l border-zinc-800 pl-8 space-y-4">

                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Social_Nodes</span>

                  <div className="flex gap-6">

                    <Github className="hover:text-cyan-500 cursor-pointer" />

                    <Linkedin className="hover:text-cyan-500 cursor-pointer" />

                    <Globe className="hover:text-cyan-500 cursor-pointer" />

                  </div>

                </div>

                <div className="border-l border-zinc-800 pl-8 space-y-4">

                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Current_Location</span>

                   <p className="text-white font-bold uppercase tracking-tighter">Manesar, Haryana, India</p>

                </div>

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>



      {/* FIXED HEXA CIRCLE NODE - BOTTOM RIGHT */}

      <div className="fixed bottom-10 right-10 z-[90] hidden md:block">

        <motion.div 

          whileHover={{ scale: 1.1 }}

          className="relative w-24 h-24 flex items-center justify-center group cursor-pointer"

          onClick={() => setIsMenuOpen(!isMenuOpen)}

        >

          <motion.div 

            animate={{ rotate: 360 }}

            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}

            className="absolute inset-0 border border-dashed border-cyan-500/40 rounded-full group-hover:border-cyan-500 transition-colors" 

          />

          <motion.div 

            animate={{ rotate: -360 }}

            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}

            className="absolute inset-2 border border-zinc-800 rounded-full" 

          />

          <div className="relative z-10 w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center overflow-hidden">

            <motion.div 

              animate={{ opacity: [0.4, 1, 0.4] }}

              transition={{ duration: 2, repeat: Infinity }}

              className="absolute inset-0 bg-cyan-500/10"

            />

            {isMenuOpen ? <X size={18} className="text-white" /> : <Hexagon size={20} className="text-cyan-500 group-hover:text-white transition-colors" />}

          </div>

          <motion.div 

            animate={{ rotate: 360 }}

            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}

            className="absolute inset-0"

          >

            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_8px_#06b6d4]" />

          </motion.div>

        </motion.div>

      </div>



      <main className="relative z-10">

        <Section id="section-0">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative">

            <div className="absolute top-0 -left-10 opacity-15 pointer-events-none">

              <Monitor size={220} strokeWidth={0.5} className="text-zinc-800" />

            </div>

            <div className="absolute bottom-0 -right-10 opacity-10 pointer-events-none">

              <Cpu size={250} strokeWidth={0.5} className="text-cyan-500" />

            </div>



            <div className="lg:col-span-8 relative">

              <motion.div initial={{ width: 0 }} animate={{ width: "80px" }} className="h-[1px] bg-cyan-500 mb-10" />

              <h1 className="text-6xl md:text-[110px] font-black text-white leading-[0.9] uppercase tracking-tighter mb-12 flex flex-col">

                <motion.span initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>

                  FULL STACK

                </motion.span>

                <motion.span 

                  initial={{ opacity: 0, x: 30 }} 

                  animate={{ opacity: 1, x: 0 }} 

                  transition={{ delay: 0.2 }}

                  className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-800"

                >

                  DEVELOPER

                </motion.span> 

              </h1>

              <p className="text-zinc-400 text-xl leading-relaxed mb-12 max-w-xl font-medium">

                Building scalable, production-ready applications with high-performance backend logic and modular frontend architectures.

              </p>

              <div className="flex flex-wrap gap-6">

                <ActionButton primary onClick={() => scrollTo('#section-2')}>

                  VIEW_WORK <ChevronRight size={14} />

                </ActionButton>

                <ActionButton href="mailto:shivirana2712@gmail.com">

                  <Mail size={14} /> CONTACT_NODE

                </ActionButton>

              </div>

            </div>



            <div className="lg:col-span-4 hidden lg:block">

              <div className="relative group perspective-1000">

                <motion.div 

                  initial={{ rotateY: 30, opacity: 0 }}

                  animate={{ rotateY: 0, opacity: 1 }}

                  transition={{ duration: 1.5, ease: "easeOut" }}

                  className="relative aspect-[4/5] overflow-hidden border border-zinc-800 bg-zinc-900 group-hover:border-cyan-500 transition-colors duration-700 shadow-2xl"

                >

                  <img 

                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200" 

                    alt="Work Env" 

                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-1000"

                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-8 left-8 right-8 text-[10px] font-mono text-cyan-500 font-black tracking-widest uppercase">

                    USER_NODE: SHIVANI_01

                  </div>

                </motion.div>

                <div className="absolute -z-10 -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-cyan-500/20" />

                <div className="absolute -z-10 -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-cyan-500/20" />

              </div>

            </div>

          </div>

        </Section>



        <Section id="section-1" className="bg-[#080808]/50">

          <div className="flex flex-col lg:flex-row gap-24">

            <div className="lg:w-1/3 sticky top-32 h-fit">

              <h2 className="text-6xl font-black uppercase mb-8 leading-none tracking-tighter text-white">CORE_<br />ENGINE</h2>

              <div className="w-16 h-1.5 bg-cyan-500 mb-10" />

              <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] leading-relaxed mb-12">

                Specialized in building modular, secure, and scalable digital infrastructure.

              </p>

              <div className="space-y-2">

                {skills.map(skill => (

                  <motion.div 

                    key={skill.name} 

                    whileHover={{ x: 10 }}

                    className="flex items-center justify-between p-5 border border-zinc-900 bg-black group hover:border-cyan-500/50 transition-all"

                  >

                    <div className="flex items-center gap-4">

                      <div className="text-zinc-700 group-hover:text-cyan-500 transition-colors">

                        {skill.icon}

                      </div>

                      <span className="text-xs font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">{skill.name}</span>

                    </div>

                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{skill.level}</span>

                  </motion.div>

                ))}

              </div>

            </div>



            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900/50 border border-zinc-900">

              {[

                { icon: <Code2 />, title: "Frontend Architecture", desc: "Crafting reactive components with high-level abstraction using React and Tailwind CSS." },

                { icon: <Database />, title: "Data Management", desc: "Expertise in SQL query optimization and relational schema design for high-load systems." },

                { icon: <Smartphone />, title: "Responsive Fluidity", desc: "Ensuring layout stability across breakpoints with advanced CSS methodologies." },

                { icon: <ShieldCheck />, title: "Security Protocols", desc: "Implementing robust authentication flows and encrypted data transmission paths." }

              ].map((item, i) => (

                <div key={i} className="p-16 bg-black hover:bg-zinc-900/10 transition-all group relative">

                  <div className="text-cyan-600 mb-10 group-hover:scale-125 transition-all duration-500">{item.icon}</div>

                  <h4 className="text-2xl font-black uppercase mb-6 text-white tracking-tighter leading-none">{item.title}</h4>

                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">{item.desc}</p>

                </div>

              ))}

            </div>

          </div>

        </Section>



        <Section id="section-2">

          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                 <div className="w-8 h-[2px] bg-cyan-500" />

                 <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em]">System Output</span>

              </div>

              <h2 className="text-7xl font-black text-white uppercase tracking-tighter leading-none">DEPLOYED_<br />UNITS</h2>

            </div>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {projects.map((proj, i) => (

              <ProjectCard key={i} proj={proj} />

            ))}

          </div>

        </Section>



        <Section id="section-3" className="bg-[#020202] relative overflow-hidden">

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0">

             <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-[spin_20s_linear_infinite]" />

             <div className="absolute inset-10 rounded-full border border-zinc-800/20 animate-[spin_15s_linear_infinite_reverse]" />

             <div className="absolute inset-20 rounded-full border border-cyan-500/5" />

          </div>



          <div className="max-w-4xl mx-auto text-center relative">

            <motion.div 

                whileHover={{ scale: 1.05 }}

                className="relative w-40 h-40 mx-auto mb-16"

            >

               <div className="absolute inset-0 rounded-full border-2 border-cyan-500 animate-pulse" />

               <div className="absolute inset-2 rounded-full border border-zinc-800" />

               <div className="absolute inset-4 overflow-hidden rounded-full bg-zinc-900 border border-zinc-800">

                  <div className="w-full h-full flex items-center justify-center">

                    <Hexagon size={40} className="text-cyan-500" />

                  </div>

               </div>

               {[0, 90, 180, 270].map((angle, i) => (

                 <motion.div 

                    key={i}

                    animate={{ rotate: 360 }}

                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}

                    className="absolute inset-0"

                 >

                    <div className="w-2 h-2 bg-cyan-500 rounded-full absolute -top-1 left-1/2 -translate-x-1/2" />

                 </motion.div>

               ))}

            </motion.div>



            <h2 className="text-[10px] font-black text-cyan-500 tracking-[1em] uppercase mb-12">Establish Connection</h2>

            <h3 className="text-8xl md:text-[140px] font-black uppercase tracking-tighter mb-20 text-white leading-none">

              TALK_TO_<br /><span className="text-zinc-800 hover:text-cyan-500 transition-colors duration-1000">SHIVANI</span>

            </h3>

            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900/50 mb-24 border border-zinc-900">

              <div className="p-16 bg-black text-left group hover:bg-zinc-900/20 transition-all">

                <Mail className="text-cyan-500 mb-8" size={32} />

                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-4">Direct Data Stream</span>

                <a href="mailto:shivirana2712@gmail.com" className="text-2xl font-black text-white hover:text-cyan-400 break-all transition-colors tracking-tighter">

                  shivirana2712@gmail.com

                </a>

              </div>

              <div className="p-16 bg-black text-left group hover:bg-zinc-900/20 transition-all border-l border-zinc-900">

                <MapPin className="text-cyan-500 mb-8" size={32} />

                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-4">Physical Node</span>

                <span className="text-2xl font-black text-white tracking-tighter uppercase">IMT MANESAR, HR</span>

              </div>

            </div>

          </div>

        </Section>

      </main>



      <footer className="border-t border-zinc-900 bg-black py-20 px-8 md:px-16">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">

          <div className="flex items-center gap-8">

            <span className="text-white">SHIVANI RANA // 2024</span>

            <div className="w-12 h-px bg-zinc-900" />

            <span>+91 7300526177</span>

          </div>

          <div className="flex items-center gap-16">

            <span className="flex items-center gap-3 text-cyan-600/50"><Activity size={14} className="text-green-500" /> ENGINE_READY</span>

          </div>

        </div>

      </footer>



      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

        

        :root { scroll-behavior: smooth; }

        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #050505; color: #d4d4d8; margin: 0; padding: 0; }

        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .perspective-1000 { perspective: 1000px; }

        

        ::-webkit-scrollbar { width: 5px; }

        ::-webkit-scrollbar-track { background: #050505; }

        ::-webkit-scrollbar-thumb { background: #18181b; }

        ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }

      `}</style>

    </div>

  );

}