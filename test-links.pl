#!/usr/bin/env perl

use v5.10.1;
use strict;
use warnings;

sub test_link ($);

my %seen_links;

my $i = 0;

my $infile = shift
    or die "No input file specified.\n";

if ($infile !~ m{((.*)/[^/]+)\.md$}) {
    die "invalid input file path: $infile (you should include the containing directory for the file in the path)\n";
}

my ($dir, $dir0) = ($1, $2);
die "absolute file path not supported" if $dir =~ m{^/};

$dir =~ s{^\./+}{}g;
$dir0 =~ s{^\./+}{}g;

open my $in, $infile
    or die "Cannot open file '$infile' for reading: $!\n";

my $in_code;
while (<$in>) {
    if (m{^```\w*\s*}) {
        if ($in_code) {
            undef $in_code;
        } else {
            $in_code = 1;
        }
    }

    next if $in_code;
    s/<!--.*?-->//g;

    while (m{ \b ( (?:ftp|https?):// [^\`\)\s\]]+ ) }xmg) {
        my $uri = $1;
        $uri =~ s/(?:\.|。|，|')$//;
        test_link $uri;
    }

    while (m{ (!)\[.*?\]\( ( .* ) \) }xmg) {
        my ($img, $uri) = ($1, $2);
        next if $uri =~ m{^(?:ftp|https?)://};
        $uri =~ s/\s+".*?"\s*$//;
        warn $uri;
        # if ($img) {
        #     $uri = "/$dir0/$uri";
        #     warn $dir0;
        #     warn $uri;
        # }
        $uri =~ s/(?:\.|。|，|')$//;
        warn $uri;
        #warn $uri;
        if ($uri =~ m{^/}) {
            warn "1111: $uri";
            test_link "https://zhuzi.dev$uri";
        } else {
            warn "2222: $uri";
            test_link "https://zhuzi.dev/$dir/$uri";
        }
    }
}

close $in;

print "\n";

sub test_link ($) {
    my $link = shift;

    $link =~ s/\#.*//;

    return if $seen_links{$link};
    $seen_links{$link} = 1;

    return if $link =~ m{^https?://(?:localhost|127\.0\.0.\d+)\b};

    my $out = `curl -I -sS '$link'`;
    print "$link\n";
    #my $out = "HTTP/1.1 200 OK";
    if ($out !~ m{\bHTTP/\d+(?:\.\d+)?\s+(?:200|30[0-9])\b}) {
        die "\nLine $.: failed to test link: $link\n$out";
    } else {
        $i++;
        print STDERR "$i OK\r";
    }
}
