require 'rubygems'
require 'zip/zip'
require 'active_support/all'

PACKAGE_PATH = 'dist'.freeze
PACKAGE_PREFIX = 'tabkit2'.freeze
PACKAGE_EXTENSION = 'xpi'.freeze
PACKAGE_EXCLUDE_REGEXP = /(\.(#{PACKAGE_EXTENSION})|Rakefile|Gemfile.*|#{PACKAGE_PATH})$/i.freeze

LOGGER = ActiveSupport::TaggedLogging.new(ActiveSupport::Logger.new($stdout))

class ActiveSupport::Logger::SimpleFormatterWithSeverity < ActiveSupport::Logger::SimpleFormatter
  def call(severity, time, progname, msg)
    "[#{severity}] [#{time}] #{msg}\n"
  end
end
LOGGER.formatter = ActiveSupport::Logger::SimpleFormatterWithSeverity.new

desc "Build XPI file, for development by default"
task :build, [:is_production_deployment] do |t, args|
  args.with_defaults(is_production_deployment: false)

  is_production_deployment = !!args.is_production_deployment

  ### Version

  # Default read file from install.rdf
  begin
    meta_file = File.read('install.rdf')
    version_from_file = meta_file.match(/<em:version>([\w\.]+)<\/em:version>/i)[1] # Match data in brackets start at one
  rescue
    raise RuntimeError, "version_from_file cannot be read from `install.rdf`"
  end

  version = version_from_file

  ### Files to include

  everything = Dir.glob "**/*"

  included = everything.select do |path|
    path !~ PACKAGE_EXCLUDE_REGEXP
  end

  input_filenames = included
  no_of_files = input_filenames.size

  ### Folder

  # Create Dir if not exist
  Dir.mkdir(PACKAGE_PATH) unless File.exists?(PACKAGE_PATH)

  ### File name

  product_filename_parts = [
    PACKAGE_PREFIX,
    version,
  ]
  # To avoid override, add time after version
  unless is_production_deployment
    product_filename_parts << 'build'
    product_filename_parts << Time.now.strftime("%Y%m%d-%H%M%S")
  end

  final_filename = [product_filename_parts.join('-'), PACKAGE_EXTENSION].join('.')

  LOGGER.info("About to build #{final_filename} with #{no_of_files} files")

  # Still exists? properly development use, just overwrite
  if File.exists?(File.join(PACKAGE_PATH, final_filename))
    raise RuntimeError, "File #{File.join(PACKAGE_PATH, final_filename)} already exists!"
  end

  ### Zip

  Zip::ZipFile.open(File.join(PACKAGE_PATH, final_filename), Zip::ZipFile::CREATE) do |zipfile|
    input_filenames.each do |filename|
      # Two arguments:
      # - The name of the file as it will appear in the archive
      # - The original file, including the path to find it
      zipfile.add(filename, filename)
    end
  end

  LOGGER.info("#{final_filename} Built")
end

desc "Build XPI file for deployment"
task :deploy do |t, args|
  Rake::Task[:build].invoke(true)
end

task default: :build


