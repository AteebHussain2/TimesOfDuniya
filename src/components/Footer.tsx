import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold mb-4 text-foreground">
                            Times Of <span className="text-rose-600 dark:text-rose-500">Duniya</span>
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Your trusted source for the latest news and updates from around the world. Stay informed with our
                            comprehensive coverage of global events.
                        </p>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Instagram className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-muted-foreground mb-4">Subscribe for daily updates</p>
                        <div className="flex">
                            <Input type="email" placeholder="Your email" className="rounded-r-none" />
                            <Button className="rounded-l-none">Subscribe</Button>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="text-center text-muted-foreground">
                    <p>&copy; 2024 ITLAA - Insights And Trends All Around. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
