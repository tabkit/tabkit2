require 'fileutils'
require 'rubygems'
require 'zip'


desc "Tabkit build script"
task :build, [:version, :is_beta] do |t, args|

  ### Version

  ### Folder

  tmp_path      = "tmp"
  product_path  = "product"
  # Create Dir if not exist
  FileUtils.mkdir_p(product_path) unless File.exists?(product_path)

  # Default read file from install.rdf

  temp_install_rdf_path   = "tmp/install.rdf"
  final_install_rdf_path  = "src/install.rdf"

  if args[:is_beta]
    unless File.exists?("versions/beta_release/install.rdf")
      raise "Please copy versions/beta_release/install.rdf.example to versions/beta_release/install.rdf to build beta versions"
    end
    FileUtils.mkdir_p(tmp_path) unless File.exists?(tmp_path)
    FileUtils.copy(final_install_rdf_path, temp_install_rdf_path, verbose: true)
    FileUtils.copy("versions/beta_release/install.rdf", final_install_rdf_path, verbose: true)
  end

  version = begin
    meta_file = File.read(final_install_rdf_path)
    version_from_file_matchdata = meta_file.match(/<em:version>(?<version>.+)<\/em:version>/i)
    version_from_file_matchdata && version_from_file_matchdata[:version] # Match data in brackets start at one
  end

  # Still missing
  # Must be something wrong
  if version.nil?
    raise "Something is wrong, version is nil"
  end

  ### Files to include

  # ["content/bindings.xml"]
  gulp_build_task_run_successfully = system("gulp build")
  unless gulp_build_task_run_successfully
    throw "gulp build failed"
  end
  paths_of_files_to_zip = Dir.glob "build/**/*"
  no_of_files = paths_of_files_to_zip.size

  ### File name

  product_filename = args[:filename] || "tabkit2_#{version}"
  product_ext = '.xpi'.freeze
  # To avoid override, add time after version
  if args[:is_beta] || File.exists?(File.join(product_path, "#{product_filename}#{product_ext}"))
    product_filename = "#{product_filename}-#{Time.now.strftime("%Y-%m-%d-%H%M%S")}"
  end

  final_filename = "#{product_filename}#{product_ext}"

  # Still exists? properly development use, just overwrite
  if File.exists?(File.join(product_path, final_filename))
    puts "Deleting should be development version"
    File.delete(File.join(product_path, final_filename))
  end

  ### Zip

  puts "About to build #{final_filename} with #{no_of_files} files"

  Zip::File.open(File.join(product_path, final_filename), Zip::File::CREATE) do |zipfile|
    paths_of_files_to_zip.each do |file_path|
      # Two arguments:
      # - The name of the file as it will appear in the archive
      # - The original file, including the path to find it
      zipfile.add(file_path.gsub(%r|^build/|, ""), file_path)
    end
  end

  puts "#{final_filename} Built"

  # Cleanup
  ## Copy back the normal file
  if File.exist?(temp_install_rdf_path)
    FileUtils.copy(temp_install_rdf_path, final_install_rdf_path, verbose: true)
  end
  if File.exist?(tmp_path)
    FileUtils.rm_rf(tmp_path, verbose: true)
  end
end

task :build_beta do
  Rake::Task[:build].invoke(nil, true)
end

task default: :build_beta
