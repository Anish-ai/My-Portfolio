"use client"

import { motion } from "framer-motion"
import { socialLinks } from "@/data/social-links"
import { personalInfo } from "@/data/personal-info"

export default function Footer() {
  // Function to handle email click
  const handleEmailClick = () => {
    window.location.href = "http://mailto:aniskum59431@gmail.com/";
  };

  return (
    <footer id="footer" className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-black -z-10"></div>

      {/* Background glow effects */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full filter blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
              Portfolio
            </h3>
            <p className="text-gray-400 mb-4">{personalInfo.footerBio}</p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.2,
                    rotate: 10,
                    color: "#8a2be2",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <motion.a
                  href="#hero"
                  className="text-gray-400 hover:text-white transition-colors inline-block"
                  whileHover={{ x: 5 }}
                >
                  Home
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#projects"
                  className="text-gray-400 hover:text-white transition-colors inline-block"
                  whileHover={{ x: 5 }}
                >
                  Projects
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#skills"
                  className="text-gray-400 hover:text-white transition-colors inline-block"
                  whileHover={{ x: 5 }}
                >
                  Skills
                </motion.a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500"></span>
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="hover:text-white transition-colors"
                >
                  {personalInfo.email}
                </a>
              </li>
              <li className="text-gray-400 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500"></span>
                {personalInfo.location}
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4">Let&apos;s Connect</h3>
            <p className="text-gray-400 mb-4">
              Have a project in mind? Let&apos;s work together to create something amazing.
            </p>
            <motion.button
              onClick={handleEmailClick}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(138, 43, 226, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-md font-medium cursor-pointer"
              data-cursor-text="Email Me"
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-gray-800 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}