import React from "react";

type Props = {
  internship: any;
  onClose: () => void;
  onApply: () => void;
  hasApplied: boolean;
};

export default function InternshipDialog({
  internship,
  onClose,
  onApply,
  hasApplied,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          {internship.title}
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Description</h3>
            <p className="text-gray-600">{internship.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Company</h3>
              <p className="text-gray-600">{internship.companyId?.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Type</h3>
              <p className="text-gray-600">{internship.type}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Duration</h3>
              <p className="text-gray-600">{internship.duration} weeks</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Salary</h3>
              <p className="text-gray-600">{internship.salary || "Unpaid"}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">
              Required Technologies
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {internship.technologies.map((tech: string) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            disabled={hasApplied}
            className={`px-4 py-2 rounded-lg ${
              hasApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {hasApplied ? "Already Applied" : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
