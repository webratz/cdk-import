# cdk-import

> Generates CDK L1 constructs for public CloudFormation Registry types and
> modules.

## Installation

```shell
npm install -g cdk-import
```

## Usage

```shell
Usage:
  cdk-import -l LANGUAGE RESOURCE-NAME[@VERSION]

Options:
  -l, --language     Output programming language                        [string]
  -o, --outdir       Output directory                                   [string]  [default: "."]
  --go-module        Module name (required if language is "golang")     [string]
  --java-package     Java package name (required if language is "java") [string]
  -h, --help         Show this usage info                               [boolean]
```

The `--language` option specifies the output programming language. Supported
languages: `typescript`, `java`, `python`, `csharp` and `golang`.

Output will be generated relative to `--outdir` which defaults to the current
working directory.

The following section describes language-specific behavior.

### Java

The `--java-package` option is required and should include the Java package name
to use for generated classes. Normally, this will be a sub-package of your
project's package.

Java source files are generates in Maven-compatible structure under
`$outdir/src/main/java/PACKAGE/` where `PACKAGE` is based on `--java-package`.

For example:

```shell
cdk-import -l java --java-package com.foo.bar.resources AWSQS::EKS::Cluster
```

Will generate class source files under `src/main/java/com/foo/bar/resources`.
All the classes will be under the package `com.foo.bar.resources`.

### Python

A Python submodule is generated under `$outdir/MODULE_NAME/` where `MODULE_NAME`
is based on the name of the resource (`AWSQS::EKS::Cluster` =>
`awsqs_eks_cluster`).

For example:

```shell
cdk-import -l python AWSQS::EKS::Cluster 
```

Will generate a subdirectory `awsqs_eks_cluster` with a Python module that can
be `import`ed.

### CSharp

A `.csproj` is generated under `$outdir/RESOURCE/` where `RESOURCE` is the
resource name (`AWSQS::EKS::Cluster`).

For example:

```shell
cdk-import -l csharp AWSQS::EKS::Cluster 
```

Will generate a directory `AWSQS::EKS::Cluster` with a `.csproj`. This can be
used in a .NET solution.

### TypeScript

A TypeScript file will be generated under `$outdir/MODULE` where `MODULE` is
derived from the resource name.

For example:

```shell
cdk-import -l typescript -o src AWSQS::EKS::Cluster
```

Will generate a file `src/awsqs-eks-cluster.ts` (note the usage of `-o` above).

### Go

If `-l golang` is used, the `--go-module` option is required and must reflect
the Go module name of the parent project module.

A Go submodule will be generated under `$outdir/PACKAGE` where `PACKAGE` is
derived from the resource name (`AWSQS::EKS::Cluster` => `awsqs-eks-cluster`).

For example:

```shell
cdk-import -l golang --go-module "github.com/foo/bar" AWSQS::EKS::Cluster
```

Will generate a Go module under: `awsqs-eks-cluster`.

## Examples

Generates constructs for the latest version AWSQS::EKS::Cluster in TypeScript:

```shell
cdk-import -l typescript AWSQS::EKS::Cluster
```

Generates construct in Go for a specific resource version:

```shell
cdk-import -l golang --go-module "github.com/account/repo" AWSQS::EKS::Cluster@1.2.0
```

Generates construct in Python under the "src" subfolder instead of working
directory:

```shell
cdk-import -l python -o src AWSQS::EKS::Cluster
```

Generates construct in Java and identifies the resource type by its ARN:

```shell
cdk-import -l java --java-package "com.acme.myproject" arn:aws:cloudformation:...
```

Modules are also supported:

```shell
cdk-import AWSQS::CheckPoint::CloudGuardQS::MODULE
```

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md)

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more
information.

## License

This project is licensed under the Apache-2.0 License.
