import React from "react";
import { render, screen } from "@testing-library/react";

import { SiteFooter } from "@/components/site-footer";

describe("SiteFooter", () => {
  it("renders copyright and footer text", () => {
    render(
      <SiteFooter
        builtWithText="Engineered for reliability."
        navLabel="Primary navigation"
        links={[
          { href: "/story", label: "Story" },
          { href: "/experience", label: "Experience" },
        ]}
      />,
    );

    expect(screen.getByText(/Malith Ileperuma/)).toBeInTheDocument();
    expect(screen.getByText("Engineered for reliability.")).toBeInTheDocument();
    expect(screen.getByText("Story")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
  });
});
