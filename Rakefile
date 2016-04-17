require 'fileutils'
require 'rubygems'
require 'zip/zip'


desc "Tabkit build script"
task :build, [:version, :is_beta] do |t, args|

  ### Version

  # Default read file from install.rdf

  if args[:is_beta]
    unless File.exists?("versions/beta_release/install.rdf")
      raise "Please copy versions/beta_release/install.rdf.example to versions/beta_release/install.rdf to build beta versions"
    end
    FileUtils.mkdir_p("tmp")
    FileUtils.copy("install.rdf", "tmp/install.rdf", verbose: true)
    FileUtils.copy("versions/beta_release/install.rdf", "install.rdf", verbose: true)
  end

  version = begin
    meta_file = File.read("install.rdf")
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
  everything = Dir.glob "**/*"

  excluded_regexp = /(\.(xpi|zip)|Rakefile|Gemfile.*|product|tmp|versions)$/i
  included = everything.select do |path|
    path !~ excluded_regexp
  end

  input_filenames = included
  no_of_files = input_filenames.size

  ### Folder

  path = "product"
  # Create Dir if not exist
  Dir.mkdir(path) unless File.exists?(path)

  ### File name

  product_filename = args[:filename] || "tabkit2_#{version}"
  product_ext = '.xpi'.freeze
  # To avoid override, add time after version
  if args[:is_beta] || File.exists?(File.join(path, "#{product_filename}#{product_ext}"))
    product_filename = "#{product_filename}-#{Time.now.strftime("%Y-%m-%d-%H%M%S")}"
  end

  final_filename = "#{product_filename}#{product_ext}"

  # Still exists? properly development use, just overwrite
  if File.exists?(File.join(path, final_filename))
    puts "Deleting should be development version"
    File.delete(File.join(path, final_filename))
  end

  ### Zip

  puts "About to build #{final_filename} with #{no_of_files} files"

  Zip::ZipFile.open(File.join(path, final_filename), Zip::ZipFile::CREATE) do |zipfile|
    input_filenames.each do |filename|
      # Two arguments:
      # - The name of the file as it will appear in the archive
      # - The original file, including the path to find it
      zipfile.add(filename, filename)
    end
  end

  puts "#{final_filename} Built"

  # Cleanup
  ## Copy back the normal file
  if File.exist?("tmp/install.rdf")
    FileUtils.copy("tmp/install.rdf", "install.rdf", verbose: true)
  end
  if File.exist?("tmp")
    FileUtils.rm_rf("tmp", verbose: true)
  end
end

task :build_beta do
  Rake::Task[:build].invoke(nil, true)
end

task default: :build_beta
