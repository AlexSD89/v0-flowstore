"use client";
import React from "react";
import { NexusLandingPage } from "@/components/nexus/NexusLandingPage";
import { mockRootProps } from "@/data/nexusLandingMockData";

export default function Page() {
  return <NexusLandingPage {...mockRootProps} />;
}
