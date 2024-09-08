/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <header className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:justify-between lg:items-center">
              <div>
                <h1 className="text-4xl font-bold">Welcome to Our Training School</h1>
                <p className="mt-4 text-lg">
                  TVET / ETP - Karama , abanyeshuri 173 bashoje amasomo yabo neza mu mashami ya Automobile repair , Electronic services , Tairoling , and Masonry .
                  Iri shuri ririmo kwandika abandi banyeshuri bashyashya , bitegura no gutangiza ishami rishya rya Musika  k` Ubufatanye na Nyundo.
                </p>
                <div className="mt-8">
                  <Link href="/register">
                    <Link href={"/register"} className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200">
                      Apply Now
                    </Link>
                  </Link>
                </div>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <img
                  className="rounded-lg shadow-lg"
                  src="./images/call.png"
                  alt="Learning trades"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Our School?</h2>
              <p className="mt-4 text-lg text-gray-600">
                We offer a variety of trade programs to help you develop the skills needed to succeed in your chosen field.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-600 text-white rounded-full">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Expert Instructors</h3>
                <p className="mt-2 text-gray-600">
                  Learn from industry professionals with years of experience.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-600 text-white rounded-full">
                  <i className="fas fa-tools"></i>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Hands-on Training</h3>
                <p className="mt-2 text-gray-600">
                  Gain practical skills with our hands-on approach to learning.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-600 text-white rounded-full">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Job Placement</h3>
                <p className="mt-2 text-gray-600">
                  We help you secure a job after you complete your training.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-600 text-white rounded-full">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Certifications</h3>
                <p className="mt-2 text-gray-600">
                  Earn recognized certifications that will boost your career.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold">Ready to Get Started?</h2>
            <p className="mt-4 text-lg">
              Take the first step towards a rewarding career. Apply for admission today and join our community of skilled professionals.
            </p>
            <div className="mt-8">
              <Link href={"/register"} className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200">
                Apply Now
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
