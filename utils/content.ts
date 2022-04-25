import { WEBSITE_URL } from 'utils/constants'

export interface MetaProps {
    description?: string
    image?: string
    title: string
    type?: string
}

const description = `Onomastics is the study of the history and origin of proper names, especially personal names. For addresses that don't have an ENS yet (or never will), it's much easier to read and remember a name than a hexadecimal address.`

export const headMetadata: MetaProps = {
    title: 'TITLE',
    description,
    image: `https://${WEBSITE_URL}/site-preview.png`,
    type: 'website',
}

export const copy = {
    title: 'Onoma Names',
    nameLowercase: 'onomanames',
    heroSubheading: description,
    heading1: 'HEADING 1',
    text1: 'TEXT 1',
    heading2: 'HEADING 2',
    text2: 'TEXT 2',
    heading3: 'HEADING 3',
    text3: 'TEXT 3',
    bottomSectionHeading: 'What is Metagame?',
    bottomSectionText: `Whether you know it or not, you're already playing The Metagame. It is the actions you take both in the hyperverse, and in the physical world that earn you experience or currency, level up your skills, or add to your inventory. Metagame makes those actions more legible, and lets you represent them in a fun way. You can mint Metagame’s phase 1 earned NFTs at `,
}
