import React from "react";
import { render, screen } from "@testing-library/react";

import { SiteFooter } from "@/components/site-footer";

describe("SiteFooter", () => {
  it("renders copyright and footer text", () => {
    render(
      <SiteFooter
        builtWithText="Engineered for reliability."
        navLabel="Primary navigation"
        socialLabel="Profiles"
        links={[
          { href: "/", label: "Home" },
          { href: "/case-studies", label: "Case Studies" },
        ]}
      />,
    );

    expect(screen.getByText(/Malith Ileperuma/)).toBeInTheDocument();
    expect(screen.getByText("Engineered for reliability.")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profiles")).toBeInTheDocument();
  });
});
