import React from 'react'

const ContactForm = () => {
  return (
   <section className="bg-gray-100 py-20 px-6">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
      Have Any Questions?
    </h2>
    <p className="mt-6 text-gray-600 max-w-2xl mx-auto leading-relaxed">
      Feel free to contact us with any questions, queries, or ideas for
      YossyVogue. Our team will respond as soon as possible.
    </p>
  </div>

  {/* Form Card */}
  <div className="mt-14">
    <form className="max-w-3xl mx-auto bg-white p-10 md:p-12 rounded-2xl shadow-lg">
      <div className="space-y-8">

        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              First Name
            </span>
            <input
              type="text"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Last Name
            </span>
            <input
              type="text"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            />
          </label>
        </div>

        {/* Email */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
          />
        </label>

        {/* Subject */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Subject</span>
          <input
            type="text"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
          />
        </label>

        {/* Message */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">
            How can we help you?
          </span>
          <textarea
            rows="5"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition resize-none"
          ></textarea>
        </label>

        {/* Newsletter */}
        <div className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 accent-black" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Sign up to our newsletter and get the latest news and updates.
          </p>
        </div>

        {/* reCAPTCHA */}
        <p className="text-xs text-gray-500 leading-relaxed">
          This site is protected by reCAPTCHA and the Google Privacy Policy and
          Terms of Service apply.
        </p>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-800 transition duration-200"
        >
          Submit Query
        </button>

      </div>
    </form>
  </div>
</section>

  )
}

export default ContactForm
