require 'rubygems'
require 'zip/zip'


desc "Tabkit build script"
task :build, :version do |t, args|

  ### Version

  version = args[:version]

  # Default read file from install.rdf
  if version.nil?
    meta_file = File.read('install.rdf')
    version_from_file = meta_file.match(/<em:version>([\w\.]+)<\/em:version>/i)[1] # Match data in brackets start at one

    version = version_from_file
  end

  ### Files to include

  # ["content/bindings.xml"]
  everything = Dir.glob "**/*"

  excluded_regexp = /(\.(xpi|zip)|Rakefile|Gemfile.*)$/i
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

  product_filename = "tabkit2 #{version}"
  product_ext = '.xpi'
  # To avoid override, add time after version
  if File.exists?(File.join(path, "#{product_filename}#{product_ext}"))
    product_filename << " - "
    product_filename << Time.now.strftime("%F")
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
end

task default: :build


