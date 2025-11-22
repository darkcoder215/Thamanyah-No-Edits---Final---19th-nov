import FigmaConverterWizard from "@/components/FigmaConverter/FigmaConverterWizard"

export default function FigmaConverterPage() {
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<h1 className="mb-2 text-3xl font-bold">Figma Template Converter</h1>
				<p className="text-gray-600">
					Convert your Figma designs to editable PDF templates with auto-fill capabilities
				</p>
			</div>

			<FigmaConverterWizard />
		</div>
	)
}
