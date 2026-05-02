import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { getLocalizedPostSummary, getLocalizedPostTitle } from "@/lib/post-translations";

function Callout({ title, body }: { title: string; body: string }) {
  return (
    <aside className="rounded-md border border-border p-4">
      <p className="font-mono text-[11px] uppercase tracking-label text-accent">{title}</p>
      <p className="pt-2 text-sm leading-7 text-text">{body}</p>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="mx-auto mb-5 w-full max-w-[720px] font-serif text-3xl leading-tight text-text">{title}</h2>
      <div className="space-y-5 text-[1rem] leading-7 text-text [&>*:not(figure)]:mx-auto [&>*:not(figure)]:w-full [&>*:not(figure)]:max-w-[720px]">
        {children}
      </div>
    </section>
  );
}

function ArticleImage({
  src,
  alt,
  caption,
  priority
}: {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <figure className="!mt-8 !mb-2 mx-auto w-full max-w-[720px]">
      <div className="overflow-hidden rounded-lg border border-border">
        <Image
          src={src}
          alt={alt}
          width={720}
          height={405}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 768px) calc(100vw - 3rem), 720px"
          className="block h-auto w-full object-contain"
        />
      </div>
      {caption ? <figcaption className="mt-2 mx-auto w-full max-w-[720px] text-sm leading-relaxed text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

export function MultipleI2cPortsRaspberryPiEditorial() {
  const language = getServerLanguage();
  const t = getDictionary(language);
  const title = getLocalizedPostTitle(
    "multiple-i2c-ports-raspberry-pi",
    "Enable Multiple I2C Ports on Raspberry Pi",
    language
  );
  const summary = getLocalizedPostSummary(
    "multiple-i2c-ports-raspberry-pi",
    "Configuring multiple I2C buses on Raspberry Pi to connect and test multiple sensor modules.",
    language
  );

  return (
    <div className="mx-auto w-full max-w-[720px] space-y-14 sm:space-y-16">
      <header className="mx-auto w-full max-w-[720px] space-y-6">
        <p className="font-mono text-[11px] uppercase tracking-label text-muted">{t.common.caseStudy.toUpperCase()}</p>
        <h1 className="font-serif text-4xl leading-tight text-text sm:text-6xl">{title}</h1>
        <p className="text-base leading-7 text-muted">{summary}</p>
        <p className="font-mono text-xs tracking-label text-muted">
          Raspberry Pi · I2C · Embedded Systems · Python · MPU6050
        </p>
      </header>

      <Section title="Introduction">
        <p>
          Let&apos;s checkout how to enable I2C protocol and configure multiple I2C devices on Raspberry Pi.
        </p>
        <p>
          In some scenarios we need to setup multiple sensor modules into Raspberry Pi to interact with multiple modules. By
          default, Raspberry Pi boards do not come with I2C interface pre-enabled, so we need to update board configuration
          first.
        </p>
        <p>
          In this post, I discuss how to enable I2C communication in Raspberry Pi and configure multiple I2C ports.
        </p>
        <ArticleImage
          src="/case-studies/multiple-i2c-ports-raspberry-pi/cover_or_first.webp"
          alt="Raspberry Pi multi-device setup"
          priority
        />
      </Section>

      <Section title="What is I2C?">
        <p>
          I2C is a well-known communication protocol used with microcontrollers. The main advantage is that it allows multiple
          modules to communicate over only two lines: Serial Data Line (SDA) and Serial Clock Line (SCL).
        </p>
      </Section>

      <Section title="Enable I2C Interface in Raspberry Pi">
        <p>Let&apos;s enable I2C interface in Raspberry Pi step by step.</p>
        <p>First, update package metadata and install essential libraries:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`sudo apt-get update
sudo apt-get install -y python-smbus i2c-tools libi2c-dev vim`}</code>
        </pre>
        <p>Open the Raspberry Pi configuration management tool:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`sudo raspi-config`}</code>
        </pre>
        <p>Select `Interface Options` and then choose `I2C`.</p>
        <ArticleImage
          src="/case-studies/multiple-i2c-ports-raspberry-pi/img_1.webp"
          alt="raspi-config interface options"
        />
        <p>Confirm enabling I2C when prompted.</p>
        <ArticleImage
          src="/case-studies/multiple-i2c-ports-raspberry-pi/img_2.webp"
          alt="raspi-config i2c option"
        />
        <p>Choose `Yes`, finish configuration, and reboot.</p>
        <ArticleImage
          src="/case-studies/multiple-i2c-ports-raspberry-pi/img_3.webp"
          alt="enable ARM I2C interface prompt"
        />
        <Callout
          title="Baseline Setup"
          body="Enable and validate default I2C first, then expand into multiple buses. This makes troubleshooting much faster."
        />
      </Section>

      <Section title="Ports">
        <p>You can run the following command to list available I2C buses:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`sudo i2cdetect -l`}</code>
        </pre>
        <ArticleImage
          src="/case-studies/multiple-i2c-ports-raspberry-pi/img_4.webp"
          alt="Raspberry Pi GPIO pinout for I2C"
          caption="pinout"
        />
      </Section>

      <Section title="Enabling Multiple I2C">
        <p>To enable additional I2C buses, edit `config.txt`.</p>
        <p>Navigate and open the configuration file:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`sudo vim boot/config.txt`}</code>
        </pre>
        <p>Then add your I2C overlay configuration. In this setup:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`dtparam=i2c_arm=on # add after this line
dtoverlay=i2c-gpio,bus=4,i2c_gpio_sda=8,i2c_gpio_scl=9
dtoverlay=i2c-gpio,bus=5,i2c_gpio_sda=12,i2c_gpio_scl=13
dtoverlay=i2c-gpio,bus=6,i2c_gpio_sda=22,i2c_gpio_scl=23`}</code>
        </pre>
        <p>Save changes and reboot:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`sudo reboot -h now`}</code>
        </pre>
      </Section>

      <Section title="Testing the Port">
        <p>Test each new bus (`4`, `5`, `6`) using:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`sudo i2cdetect -y [bus]`}</code>
        </pre>
        <p>You should get output similar to:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- 68 -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --`}</code>
        </pre>
      </Section>

      <Section title="Test multiple I2C modules">
        <p>In this example, I added 3 MPU6050 modules to Raspberry Pi to show sensor readings.</p>
        <h3 className="pt-1 font-serif text-2xl leading-tight text-text">Diagram</h3>
        <ArticleImage
          src="/case-studies/multiple-i2c-ports-raspberry-pi/img_5.webp"
          alt="MPU6050 sensor wiring diagram"
          caption="sensor wiring diagram"
        />
        <p>
          Here, three modules labeled `A`, `B`, and `C` are connected to different I2C ports on Raspberry Pi.
        </p>
        <h3 className="font-serif text-2xl leading-tight text-text">Pinout</h3>
        <ArticleImage
          src="/case-studies/multiple-i2c-ports-raspberry-pi/img_6.webp"
          alt="MPU6050 to Raspberry Pi pin mapping"
          caption="pinout"
        />
      </Section>

      <Section title="Installing MPU6050 Library">
        <p>
          There are multiple ways to install the `mpu6050` library on Raspberry Pi. Here we use the PyPI package.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`pip install mpu6050-raspberrypi`}</code>
        </pre>
      </Section>

      <Section title="Example Code">
        <p>Run the following example to read from all three sensors:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`from mpu6050 import mpu6050

mpuA = mpu6050(0x68, bus=5)
mpuB = mpu6050(0x68, bus=4)
mpuC = mpu6050(0x68, bus=6)

while True:
    accel_data_mpuA = mpuA.get_accel_data()
    print("Acceleration mpuA X -> " + str(accel_data_mpuA['x']))
    print()

    accel_data_mpuB = mpuB.get_accel_data()
    print("Acceleration mpuB X -> " + str(accel_data_mpuB['x']))
    print()

    accel_data_mpuC = mpuC.get_accel_data()
    print("Acceleration mpuC X -> " + str(accel_data_mpuC['x']))
    print()

    print("------------")`}</code>
        </pre>
      </Section>

      <Section title="Final Thoughts">
        <p>
          To conclude, there are alternative methods to use multiple I2C devices, such as placing multiple devices on the same
          bus or using I2C multiplexers.
        </p>
        <p>
          However, this approach gives you additional workable I2C ports so you can connect and test more modules directly.
        </p>
      </Section>

      <Section title="References">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <a href="https://github.com/m-rtijn/mpu6050" target="_blank" rel="noopener noreferrer" className="quiet-link text-accent">
              https://github.com/m-rtijn/mpu6050
            </a>
          </li>
          <li>
            <a href="https://forums.raspberrypi.com/viewtopic.php?t=205576" target="_blank" rel="noopener noreferrer" className="quiet-link text-accent">
              https://forums.raspberrypi.com/viewtopic.php?t=205576
            </a>
          </li>
          <li>
            <a href="https://forums.raspberrypi.com/viewtopic.php?t=244947" target="_blank" rel="noopener noreferrer" className="quiet-link text-accent">
              https://forums.raspberrypi.com/viewtopic.php?t=244947
            </a>
          </li>
          <li>
            <a href="https://forums.raspberrypi.com/viewtopic.php?t=271200" target="_blank" rel="noopener noreferrer" className="quiet-link text-accent">
              https://forums.raspberrypi.com/viewtopic.php?t=271200
            </a>
          </li>
        </ul>
      </Section>

      <footer className="mx-auto w-full max-w-[720px] border-t border-border pt-6">
        <p className="font-mono text-[11px] tracking-label text-muted">{t.common.originallyPublishedOnMedium}</p>
        <a
          href="https://medium.com/@mileperuma/enable-multiple-i2c-ports-on-raspberry-pi-5a8807471737"
          target="_blank"
          rel="noopener noreferrer"
          className="quiet-link mt-2 inline-block text-sm text-accent"
        >
          {t.common.viewOriginalArticleOnMedium}
        </a>
        <div className="pt-4">
          <Link href="/case-studies" className="quiet-link text-sm text-muted">
            {t.common.backToCaseStudies}
          </Link>
        </div>
      </footer>
    </div>
  );
}
