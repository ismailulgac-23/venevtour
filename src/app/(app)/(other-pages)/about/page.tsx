import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import SectionClientSay from '@/components/SectionClientSay'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import rightImg from '@/images/about-hero-right.png'
import { Metadata } from 'next'
import SectionFounder from './SectionFounder'
import SectionHero from './SectionHero'
import SectionStatistic from './SectionStatistic'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description:
    'Hakkımızda sayfası, misyonumuz, değerlerimiz ve şirketimizin arkasındaki ekip hakkında genel bir bakış sunar. Sektörümüzdeki mükemmellik ve yenilikçilik taahhüdümüzü vurgular.',
}

const PageAbout = () => {
  return (
    <div className="relative overflow-hidden">
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />

      <div className="container flex flex-col gap-y-16 py-16 lg:gap-y-28 lg:py-28">
        <SectionHero
          rightImg={rightImg}
          heading="👋 Hakkımızda."
          subHeading="Bağımsız ve tarafsız bir yaklaşımla, her gün dünyanın dört bir yanındaki milyonlarca insanı bilgilendiren, eğiten ve eğlendiren özgün, dünya standartlarında içerikler sunuyoruz."
        />

        <SectionFounder />
        <div className="relative py-20">
          <BackgroundSection />
          <SectionClientSay />
        </div>

        <SectionStatistic />

        <SectionSubscribe2 />
      </div>
    </div>
  )
}

export default PageAbout
