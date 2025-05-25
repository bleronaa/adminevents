"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    setTokenExists(!!token); 
  }, []);

  // Mos shfaq Sidebar në faqen e login-it ose nëse nuk ka token
  if (pathname === "/login" || !tokenExists) {
    return null;
  }

  return <Sidebar />;
}