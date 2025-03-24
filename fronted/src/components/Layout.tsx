import { Providers } from '@/components/providers';
import { ProductProvider } from '@/context/ProductContext';
import React, { ReactNode } from 'react';
import Footer from './Footer';
import Navbar from './NavigationBar';


type LayoutProps = {
    children: ReactNode; // ReactNode allows any valid React child
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <Providers>
    <ProductProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
    </ProductProvider>
    </Providers>
);

export default Layout;
